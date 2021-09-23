const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const catchAsync = require("./catchAsync");
const appError = require("./appError");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //1: get the currently booking tour
  const tour = await Tour.findById(req.params.tourId);

  //2: create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`http://127.0.0.1:7000/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: "pkr",
        quantity: 1,
      },
    ],
  });

  //3:create session as response
  res.status(200).json({
    status: "success",
    session,
  });
});
