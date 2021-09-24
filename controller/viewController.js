const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const catchAsync = require("./catchAsync");

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render("overview", {
    title: "all tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //1: get the data from requested tour including reviews and guides
  //console.log(req.params.slug);
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  //console.log("slug: ", tour);
  res.status(200).render("tour", {
    title: "hunza khanrab tour",
    tour,
  });
});

exports.getSignupTour = catchAsync(async (req, res, next) => {
  res.status(200).render("signup", {
    title: "signUp to your account",
  });
});

exports.getLoginTour = catchAsync(async (req, res, next) => {
  res.status(200).render("login", {
    title: "Log into your account",
  });
});

exports.getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render("accounts", {
    title: "your Account",
  });
});

// exports.updateUserData = catchAsync(async (req, res, next) => {
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user._id,
//     {
//       name: req.body.name,
//       email: req.body.email,
//     },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );

//   res.status(200).render("accounts", {
//     title: "Your Account",
//     user: updatedUser,
//   });
// });
