const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) =>
{
  try
  {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.SECRET_WORD);
    let user = await User.findBy(['id'], [decoded.id]);
    if (user.length === 0)
      throw new Error();
    user = user[0];
    const hasToken = await user.hasToken(token);
    if (!hasToken)
      throw new Error();
    req.user = user;
    req.token = token;
    next()
  }
  catch (error)
  {
    res.status(401).send({ error1: "Please authenticate!", error });
  }
}

module.exports = auth;