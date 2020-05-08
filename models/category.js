const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    category_Name: { type: String, unique: true, required: true }
  },
  {
    collection: "Category"
  }
);
const Category = mongoose.model("Category", schema);
module.exports = Category;
