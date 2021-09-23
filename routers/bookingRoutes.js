const express = require("express");
const bookingController = require("../controller/bookingController");
const userMiddleware = require("../middlewares/userMiddleware");

const bookingRouter = express.Router();

bookingRouter.get(
  "/checkout-session/:tourId",
  userMiddleware.protect,
  bookingController.getCheckoutSession
);

module.exports = bookingRouter;
