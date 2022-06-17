const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Buyer = require('../models/buyer');
const Seller = require('../models/seller');

const auth = async (req, res, next) =>
{
  try
  {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.SECRET_WORD);
    const user = await User.findOneBy({ id: decoded.id });
    if (user === undefined)
      throw new Error("Please authenticate!");
    const hasToken = await user.hasToken(token);
    if (!hasToken)
      throw new Error("Please authenticate!");
    const buyer = await Buyer.findOneBy({ user_id: user.id });
    const seller = await Seller.findOneBy({ user_id: user.id });
    req.user = user;
    req.buyer = buyer;
    req.seller = seller;
    req.token = token;
    next()
  }
  catch (error)
  {
    console.log(error)
    res.status(401).send({ error: error.message });
  }
}

module.exports = auth;