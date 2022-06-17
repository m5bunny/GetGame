const buyer = (req, res, next) =>
{
  if (!req.buyer)
    throw new Error("You do not have permission for doing this!");
  next();
}

const seller = (req, res, next) =>
{
  if (!req.seller)
    throw new Error("You do not have permission for doing this!");
  next();
}

module.exports = {
  buyer,
  seller
}