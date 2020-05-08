const express = require("express");
const app = express();
require("express-async-errors");
require("dotenv").config();
const cors = require("cors");

const db = require("./db");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const categoryRoute = require("./routes/category");

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
//middleware
// app.use((req, res, next) => {
//   res.json({
//     "request url": req.url,
//     method: req.method,
//     "current time": Date.now()
//   });
// });

app.use("/products", productRoute);
app.use("/users", userRoute);
app.use("/category", categoryRoute);

app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  if (statusCode >= 500) {
    return res.status(statusCode).json({
      message: "Sonmething went Wrong",
      type: "INTERNAL_SERVER_ERROR",
      details: []
    });
  } else {
    res.status(statusCode).json({
      message: err.message,
      type: err.type,
      details: err.details
    });
  }
});
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
