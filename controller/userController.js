const User = require("../models/userModel");
const APIFeatures = require("./apiFeatures");
const jwt = require("jsonwebtoken");
const catchAsync = require("./catchAsync");
const crypto = require("crypto");
const factory = require("./handlerFactory");
const appError = require("./appError");
const Email = require("../utils/email");
const multer = require("multer");
const sharp = require("sharp");

// const multerStorage = multer.diskStorage({
//   diskStorage: (req, file, cb) => {
//     cb(null, "public/img/users");
//   },

//   filename: (req, file, cb) => {
//     //user-656ghguhy7666xs455-767676767.jpg
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new appError("Not an image! please upload an image", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// exports.getMe = (req, res, next) => {
//   req.params.id = req.user.id;
//   next();
// };

exports.updateMe = catchAsync(async (req, res, next) => {
  console.log("body : ", req.body);
  console.log(req.file);
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "successfully updated",
    user: updatedUser,
  });
});

const createSendToken = async (user, statusCode, res) => {
  const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRES_IN,
  });
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    secure: true,
    httpOnly: true,
  });
};

// exports.getStudents = catchAsync(async (req, res, next) => {
//   console.log(req.query);
//   const feature = new APIFeatures(Student.find(), req.query)
//     .filter()
//     .sorting()
//     .limitingFields()
//     .pagination();
//   const allStudents = await feature.query;
//   //console.log(allStudents);
//   res.status(200).send({
//     status: "success",
//     data: {
//       allStudents,
//     },
//   });
// });

exports.getUsers = catchAsync(async (req, res, next) => {
  console.log(req.query);
  const feature = new APIFeatures(User.find(), req.query)
    .filter()
    .sorting()
    .limitingFields()
    .pagination();
  const users = await feature.query;
  //const users = await User.find();
  console.log(users);
  if (!users) {
    return next(new appError("no user exist in the dataBase", 400));
  }
  res.status(200).json({
    length: users.length,
    status: "success",
    data: {
      users,
    },
  });
});

exports.getUserWithId = catchAsync(async (req, res, next) => {
  const ID = req.params.id;
  const user = await User.findById(ID);
  console.log("us");
  if (!user) {
    return next(new appError(`invalid ID`, 404));
  } else {
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
});

exports.signUp = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  const url = `${req.protocol}://${req.get("host")}/me`;
  console.log(url);
  await new Email(user, url).sendWelcome();

  createSendToken(user, 200, res);
  console.log(user);
  const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRES_IN,
  });
  res.status(201).json({
    status: "success",
    message: "successfully signUp",
    token,
    data: {
      user,
    },
  });
});

exports.accessVerification = catchAsync(async (req, res, next) => {
  // const { email } = req.body;
  // const user = await User.findOne({ email }).select("+password");
  const user = req.user;
  if (!user) {
    return next(new appError(`user doesn't exist with ${email} mail`, 404));
  } else {
    res.status(200).json({
      status: "Success",
      data: {
        user,
      },
    });
  }
});

exports.Login = catchAsync(async (req, res, next) => {
  const candidate = req.body;
  const user = await User.findOne({ email: candidate.email }).select(
    "+password"
  );
  if (!user) {
    return next(
      new appError(`no user exist with ${candidate.email} email`, 404)
    );
  }
  console.log(user);
  const correct = await user.correctPassword(candidate.password, user.password);
  console.log(correct);
  if (correct) {
    createSendToken(user, 200, res);

    const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: process.env.EXPIRES_IN,
    });

    res.status(200).json({
      status: "success",
      token: token,
      data: {
        user,
      },
    });
  } else {
    next(new appError(`!incorrect Password`, 400));
  }
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  //check user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new appError(`no user exist with that email`, 404));
  }

  //generate the random reset token
  const resetToken = await user.createPasswordResetToken();
  console.log("resetToken", resetToken);
  await user.save({ validateBeforeSave: false });

  //Send it users Email

  try {
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/u1/users/resetpassword/${resetToken}`;
    await new Email(user, resetUrl).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to the email",
    });
  } catch (error) {
    console.log("error a rha : ", error);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new appError(
        `there was an error to sending the email! please try again later`,
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //get user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //if token is not expired and their is user then set the new password
  if (!user) {
    return next(new appError(`Token is invalid or has expired`));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRES_IN,
  });
  res.status(200).json({
    success: "ok",
    token: {
      token,
    },
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1: get user from collection
  console.log("print ho rha hai", req.user);
  const user = await User.findById(req.user._id).select("+password");
  console.log("print ho rha hai", user);
  console.log(req.body);

  if (req.body.data.newPassword !== req.body.data.passwordConfirm)
    return next(
      new appError("new password and confirm password should be same", 400)
    );

  //2: check if posted current password is correct or not
  const result = await user.correctPassword(
    req.body.data.passwordCurrent,
    user.password
  );

  console.log(result);
  //if(result)
  if (result) {
    user.password = req.body.data.newPassword;
    user.confirmPassword = req.body.data.passwordConfirm;
    await user.save();
  } else {
    return next(new appError(`your current password is wrong`, 400));
  }

  console.log("everything is going ok!");

  //3: update changedAtPasswordAt property for the user
  //4: log the user in, send JWT
  const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRES_IN,
  });

  console.log("everything is going ok!", token);

  res.status(200).json({
    status: "success",
    message: "password successfully updated",
    token: {
      token,
    },
    user,
  });
});

// exports.updateUserData = factory.updateUser(User);
exports.updateUserData = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const updateUser = await User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.data.name, email: req.body.data.email },
    {
      new: true,
      runValidators: true,
    }
  );
  console.log(updateUser);
  if (updateUser) {
    res.status(200).json({
      status: "success",
      message: "Successfully Updated!",
      updateUser,
    });
  } else {
    res.status(400).json({
      status: "error",
      message: "Something Went Wrong!",
    });
  }
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    next(
      new appError(
        "please provide email and password to delete your account",
        400
      )
    );
  }
  const user = await User.findById(req.user._id).select("+password");
  //if (!user) return next(new appError(`!invalid email`));
  const result = await user.correctPassword(req.body.password, user.password);
  console.log(result);
  if (result) {
    await User.findByIdAndDelete(user._id);
    //console.log(deleteUser);
    res.status(200).json({
      status: "ok",
      message: "the user successfully deleted!",
    });
  } else {
    next(new appError("!incorrect Password", 400));
  }
});

exports.deleteUserWithId = factory.deleteOne(User);
