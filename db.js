const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
mongoose
  .connect(
    "mongodb+srv://Mariam:Mariam@cluster0-6dg7e.mongodb.net/test?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log("sucess");
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

module.exports = mongoose;
