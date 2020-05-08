const Product = require("../models/product");
const customError = require("../Helpers/customError");
module.exports = async (req, res, next) => {
  const productId = req.params.id;
  const userId = req.user.id;
  const product = await Product.findById(productId);

  if (!product.userId.equals(userId)) {
    throw customError("Not Authorized", 403);
    //   err.statusCode = 403;
    //   throw err;
  }
  next();
};
