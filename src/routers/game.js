const express = require('express');
const Game = require('../models/game');
const DicItem = require('../models/dicItem');
const Discount = require('../models/discount');
const Patch = require('../models/patch');
const auth = require('../middleware/auth');
const permission = require('../middleware/permission');
const checkDiscountCode = require('../middleware/checkDiscountCode');
const router = new express.Router();

router.post('/', [auth, permission.seller], async (req, res) =>
{
  let game;
  try
  {
    game = new Game({
      ...req.body,
      id_sprzedajacy: req.seller.id,
    });
    await game.save();
    game = await Game.findOneBy({ id_sprzedajacy: req.seller.id, nazwa: game.nazwa });
    const patch = new Patch({ ...req.body.patch, id_gry: game.id });
    await patch.save();
    await game.addImages(req.body.images);
    await game.addTags(req.body.tags);
    res.status(201).send(game);
  }
  catch (error)
  {
    if (game.id !== null)
      await game.delete();
    console.log(error);
    res.status(404).send({ errno: error.errno, message: error.message });
  }
});

router.post('/addToCart/:id', [auth, permission.buyer, checkDiscountCode], async (req, res) =>
{
  try
  {
    const game = await Game.findOneBy({ id: req.params.id });
    if (!game)
      throw Error(`There is no game with id ${ req.params.id }`);
    const rabat = await Discount.findOneBy({})
    const cart = await req.buyer.getCart();
    const games = cart.filter(g => g.id_gry === game.id);
    if (games[0])
      throw Error(`The game with id ${ req.params.id } is already in the cart`);
    let price = game.cena;
    if (req.discount)
      price = req.discount.getNewPrice(game.cena);
    await req.buyer.addGameToCart(game.id, price, req.discount.id);
    res.send(await req.buyer.getCart());
  }
  catch (error)
  {
    res.status(404).send(error.message);
  }
});

router.post('/removeFromCart/:id', [auth, permission.buyer], async (req, res) =>
{
  try
  {
    let cart = await req.buyer.getCart();
    const games = cart.filter(game => game.id_gry === parseInt(req.params.id));
    if (!games[0])
      throw Error(`There is no game with id ${ req.params.id } in the cart`);
    await req.buyer.removeGameFromCart(games[0].id_gry);
    res.send(await req.buyer.getCart());
  }
  catch (error)
  {
    res.status(404).send(error.message);
  }
});

router.get('/getCart', [auth, permission.buyer], async (req, res) =>
{
  try
  {
    res.send(await req.buyer.getCart());
  }
  catch (error)
  {
    res.status(500).send();
  }
});

module.exports = router;