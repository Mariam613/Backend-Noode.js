const mongoose = require("mongoose");
const _ = require("lodash");
const schema = new mongoose.Schema(
  {
    userId: { type: mongoose.ObjectId, ref: "User" },
    name: { type: String, unique: true, required: true },
    description: { type: String, required: true, min: 10, max: 500 },
    price: { type: Number, required: true },
    category: { type: mongoose.ObjectId, ref: "Category" },
    discount: { type: Number, required: false },
    imgUrl: { type: String, required: false }
  },
  {
    // timestamps: true,
    // virtual: true,
    collection: "Products",
    toJSON: {
      virtuals: true,
      transform: doc => {
        return _.pick(doc, [
          "id",
          "userId",
          "name",
          "description",
          "price",
          "category",
          "discount",
          "imgUrl",
          "tags",
          "user"
        ]);
      }
    }
  }
);
schema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id"
});

// schema.virtual("category", {
//   ref: "Category",
//   localField: "userId", // Find people where `localField`
//   foreignField: "_Id"
// });
const Product = mongoose.model("Product", schema);
module.exports = Product;
