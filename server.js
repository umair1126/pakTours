const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const { app } = require("./app");

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`DB connection is successfully build`);
  })
  .catch((err) => {
    //console.log(`sorry! DB connection failed!`);
    console.log(err);
  });

//console.log(tours);

//console.log(process.argv);

app.listen(process.env.PORT, () => {
  console.log(`the port ${port} is to be listening`);
});
