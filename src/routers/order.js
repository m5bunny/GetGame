const express = require('express');
const auth = require('../middleware/auth');
const permission = require('../middleware/permission');
const Order = require('../models/order');
const Buyer = require('../models/buyer');
const License = require('../models/license');
const Discount = require('../models/discount');
const DicItem = require('../models/dicItem');
const Game = require('../models/game');
const db = require('../utils/dbOperations');
const router = new express.Router();

router.post('/', [auth, permission.buyer], async (req, res) =>
{
  let order;
  try {
    const cart = await req.buyer.getCart();
    if (cart.length === 0)
      throw new Error('Cart is empty');
    const price = cart.reduce((prev, cur) => prev + cur.cena, 0);
    const receiver_id = req.body.receiver_id || req.buyer.id;
    const receiver = await Buyer.findOneBy({id: receiver_id});
    if (!receiver)
      throw new Error('There is no such user');
    const creationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    order = new Order({
      buyer_id: req.buyer.id,
      receiver_id: receiver.id,
      kwota: price,
      forma_platnosci: req.body.paymentsMethod,
      data: creationDate
    });
    await order.save();
    order = await Order.findOneBy({ data: creationDate, buyer_id: req.buyer.id, receiver_id: receiver.id });
    for (const position of cart)
    {
      if (position.rabat_id)
      {
        const discount =  await Discount.findOneBy({ id: position.rabat_id });
        await discount.use(req.buyer.id);
      }
      const license = new License({
        ...position,
        ...req.body,
        zamowienie_id: order.id
      });
      await license.activate();
    }
    await req.buyer.clearCart();
    res.status(201).send(order);
  }
  catch (error)
  {
    if (order !== undefined && order.id !== null)
      await order.delete();
    console.log(error);
    res.status(404).send({ errno: error.errno, message: error.message });
  }
});

module.exports = router;