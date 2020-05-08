const express = require("express");
const router = express.Router(); //create router
const querystring = require("querystring");
const _ = require("lodash");
// const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb("./uploads/");
//   },
//   filename: function(req, file, cb) {
//     cb(null, file.fieldnames);
//   }
// });
// const upload = multer({ storage: storage });
const Product = require("../models/product");
const authenticationMiddleWare = require("../middlewares/authentication");
const ownnerAuthorization = require("../middlewares/ownerAuthorization");

router.post(
  "/Add-product",
  authenticationMiddleWare,
  // upload.array("imgUrl"),
  async (req, res, next) => {
    // console.log(req.file);
    const userId = req.user.id;
    const { name, description, price, category, discount } = req.body;

    const product = new Product({
      userId,
      name,
      description,
      price,
      category,
      discount
      // imgUrl: req.file.path,
    });
    await product.save();
    res.json({ message: "product added successfully", product });
  }
);
router.get("", async (req, res, next) => {
  const { search, category, sortBy, pageNo, size } = req.query;
  // let pageNumber = parseInt(pageNo);
  // let pageSize = parseInt(size);
  const pageSize = size ? Number(size) : 9;
  const pageNumber = pageNo ? Number(pageNo) : 1;
  let products;
  if (search && category != 0) {
    products = await Product.find({
      name: { $regex: new RegExp(".*" + search.toLowerCase() + ".*") },
      category: category
    }).populate("category");
  } else if (!search && category == 0) {
    products = await Product.find({}).populate("category");
  } else if (search && category === "0") {
    products = await Product.find({
      name: { $regex: new RegExp(".*" + search.toLowerCase() + ".*") }
    }).populate("category");
  } else if (category && !search) {
    products = await Product.find({ category: category }).populate("category");
  }
  //sort
  const str = sortBy ? sortBy.split(":") : "";
  if (str) {
    if (str === "name") {
      products = _.orderBy(products, `${str[0]}`, "asc");
    } else {
      products = _.orderBy(products, `${str[0]}`, `${str[1]}`);
    }
  }

  //pagination

  if (pageNumber < 0 || pageNumber === 0) {
    response = {
      error: true,
      message: "invalid page number, should start with 1"
    };
    return res.json(response);
  }
  // query.skip = pageSize * (pageNumber - 1);
  // query.limit = pageSize;
  let start = (pageNumber - 1) * pageSize;
  const count = products.length;
  if (count > pageSize) {
    products = products.slice(start, start + pageSize);
  }
  let noofpages = Math.ceil(count / pageSize);
  // console.log(noofpages + "no");
  res.status(200).json({ products, noofpages });
});
//get by id
router.get(
  "/:id",

  async (req, res, next) => {
    const id = req.params.id;
    const product = await Product.findById(id).populate("category");
    res.status(200).json(product);
  }
);

//edit
router.patch(
  "/:id",
  authenticationMiddleWare,
  ownnerAuthorization,
  async (req, res, next) => {
    const id = req.params.id;
    const { userId, name, description, price, category, discount } = req.body;
    const theProductAfterEdit = await Product.findByIdAndUpdate(
      id,
      {
        userId,
        name,
        description,
        price,
        category,
        discount
        // imgUrl: req.file.path
      },
      {
        omitUndefined: true,
        new: true
      }
    );

    res.json({
      message: "product was edited successfully",
      product: theProductAfterEdit
    });
  }
);

//Delete
router.delete(
  "/:id",
  authenticationMiddleWare,
  ownnerAuthorization,
  async (req, res, next) => {
    const id = req.params.id;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product is Deleted" });
  }
);

module.exports = router;
