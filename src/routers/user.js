const express = require('express');
const User = require('../models/user');
const Buyer = require('../models/buyer');
const Seller = require('../models/seller');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const createBuyerSeller = require('../utils/createBuyerSeller');
const router = new express.Router();

router.post('/', async (req, res) =>
{
  let user;
  try
  {
    req.body.password = await bcrypt.hash(req.body.password, 8);
    user = new User(req.body);
    let buyerSeller;
    await user.save();
    user = await User.findOneBy({ email: user.email });
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
    if (user.id !== null)
      await user.delete();
    console.log(error);
    res.status(404).send({ errno: error.errno, message: error.message });
  }
});

router.post('/login', async (req, res) =>
{
  try
  {
    const user = await User.findOneBy({ email: req.body.email });
    if (user === undefined)
      throw new Error('The email or password are wrong!')
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch)
      throw new Error('The email or password are wrong!')
    const token = await user.generateAuthToken();
    res.send({ user, token });
  }
  catch (error)
  {
    res.status(404).send(error.message);
  }
});

router.post('/logout', auth, async (req, res) =>
{
  try
  {
    await req.user.deleteToken(req.token);
    res.send();
  }
  catch (error)
  {
    res.status(500).send();
  }
});

router.post('/logoutAll', auth, async (req, res) =>
{
  try
  {
    await req.user.deleteAllTokens();
    res.send();
  }
  catch (error)
  {
    res.status(500).send();
  }
});

router.post('/sellers', auth, async (req, res) =>
{
  try
  {
    if (req.seller !== undefined)
      throw new Error("The seller is already exist");
    const seller = new Seller({ ...req.body, user_id: req.user.id })
    await seller.save();
    res.status(201).send();
  }
  catch (error)
  {
    res.status(400).send(error.message);
  }
});

router.post('/buyers', auth, async (req, res) =>
{
  try
  {
    if (req.buyer !== undefined)
      throw new Error("The buyer is already exist");
    const buyer = new Buyer({ ...req.body, user_id: req.user.id })
    await buyer.save();
    res.status(201).send();
  }
  catch (error)
  {
    res.status(400).send(error.message);
  }
});

router.get('/me', auth, async (req, res) =>
{
  try
  {
    res.send({ user: req.user, seller: req.seller, buyer: req.buyer });
  }
  catch (error)
  {
    res.status(404).send(error.message);
  }
});

module.exports = router;