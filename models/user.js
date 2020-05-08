const mongoose = require("mongoose");
const util = require("util");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 7;
const jwtSecret = process.env.JWT_SECRET;
const sign = util.promisify(jwt.sign);
const verify = util.promisify(jwt.verify);

const schema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  {
    collection: "Users",
    toJSON: {
      // virtuals: true,
      transform: doc => {
        return _.pick(doc, ["email", "password", "id"]);
      }
    }
  }
);
// schema.virtual("products", {
//   ref: "Product",
//   localField: "_id", // Find people where `localField`
//   foreignField: "userId"
// });
schema.pre("save", async function() {
  const userInstance = this;
  if (this.isModified("password")) {
    userInstance.password = await bcrypt.hash(
      userInstance.password,
      saltRounds
    );
  }
});
schema.methods.comparePassword = async function(plainPassword) {
  const userInstance = this;
  return bcrypt.compare(plainPassword, userInstance.password);
};
schema.methods.generateToken = async function(expiresIn = "30m") {
  const userInstance = this;
  return sign({ Id: userInstance.id }, jwtSecret, { expiresIn });
};
schema.statics.getUserFromToken = async function(token) {
  const User = this;
  const payload = await verify(token, jwtSecret);
  const currentUser = await User.findById(payload.Id);
  if (!currentUser) throw Error("user not found");
  return currentUser;
};

const User = mongoose.model("User", schema);
module.exports = User;
