const Buyer = require('../models/buyer');
const Seller = require('../models/seller');

const createBuyerSeller = async (Class, body) =>
{
  let buyerSeller = new Class(body);
  await buyerSeller.save();
  buyerSeller = await Class.findBy({user_id: body.user_id});
  buyerSeller = buyerSeller[0];
  return buyerSeller;
}

module.exports = createBuyerSeller;