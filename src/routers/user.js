const express = require('express');
const pool = require('../db/connection');
const User = require('../models/user')
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const router = new express.Router();

router.post('/', async (req, res) =>
{
  try
  {
    req.body.password = await bcrypt.hash(req.body.password, 8);
    let user = new User({
      email: req.body.email, password: req.body.password
    });
    await user.save();
    user = await User.findBy(['email'], [user.email]);
    user = user[0];
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  }
  catch (error)
  {
    console.log(error)
    res.status(404).send({ errno: error.errno, message: error.message });
  }
});

router.get('/:id', auth, async (req, res) =>
{
  try
  {
    const rows = await User.findBy(['id'], [req.params.id]);
    if (rows.length === 0)
      return res.status(404).send();
    res.send(rows[0]);
  }
  catch (error)
  {
    res.status(404).send(error.message);
  }
});

module.exports = router;