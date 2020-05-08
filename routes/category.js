const express = require("express");
const router = express.Router(); //create router

const Category = require("../models/category");
router.post("/Add-Category", async (req, res, next) => {
  const { category_Id, category_Name } = req.body;

  const category = new Category({
    category_Id,
    category_Name
  });
  await category.save();
  res.json({ message: "category added successfully", category });
});
router.get("/", async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json(categories);
});
module.exports = router;
