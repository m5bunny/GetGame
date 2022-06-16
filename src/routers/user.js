const express = require('express');
const User = require('../models/user');
const Buyer = require('../models/buyer');
const Seller = require('../models/seller');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const createBuyerSeller = require('../utils/createBuyerSeller');
const router = new express.Router();

// User routs
router.post('/', async (req, res) =>
{
  let user;
  try
  {
    req.body.password = await bcrypt.hash(req.body.password, 8);
    user = new User(req.body);
    let buyerSeller;
    await user.save();
    user = await User.findBy({ email: user.email });
    user = user[0];
    if (req.body.userType === 'buyer')
      buyerSeller = await createBuyerSeller(Buyer, { ...req.body,user_id: user.id });
    else if (req.body.userType === 'seller')
      buyerSeller = await createBuyerSeller(Seller, { ...req.body,user_id: user.id });
    else
      throw new Error("You can register only buyer or seller!");
    const token = await user.generateAuthToken();
    res.status(201).send({ user, buyerSeller, token });
  }
  catch (error)
  {
    if (user !== undefined)
      await user.delete();
    console.log(error);
    res.status(404).send({ errno: error.errno, message: error.message });
  }
});

router.get('/me', auth, async (req, res) =>
{
  try
  {
    const rows = await User.findBy({ id: req.user.id });
    res.send(rows[0]);
  }
  catch (error)
  {
    res.status(404).send(error.message);
  }
});

module.exports = router;