const Discount = require("../models/discount");

const checkDiscountCode = async (req, res, next) =>
{
  try {
    const discountId = req.query.discount;
    if (discountId) {
      const discount = await Discount.findOneBy({id: discountId});
      if (!discount)
        throw new Error("There is no such discount code!");
      const rightDiscountCode = await discount.checkGame(req.params.id);
      if (!rightDiscountCode)
        throw new Error("There is no such discount code!");
      req.discount = discount;
    }
    next();
  }
  catch (error)
  {
    console.log(error)
    res.status(404).send({ error: error.message });
  }
}

module.exports = checkDiscountCode;