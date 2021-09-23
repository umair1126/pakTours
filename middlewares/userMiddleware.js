const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../controller/catchAsync");
const appError = require("../controller/appError");
//Middleware

//middleware to verify the body
exports.signupBodyVerification = catchAsync(async (req, res, next) => {
  const body = req.body;
  console.log(body);
  if (!body.name || !body.email || !body.password || !body.confirmPassword) {
    return next(new appError("please filled the data", 400));
  } else if (body.password !== body.confirmPassword)
    return next(
      new appError("password and confirm Password should be same", 400)
    );
  const user = await User.findOne({ email: body.email });
  if (user)
    return next(
      new appError("this email already exist please try another", 400)
    );
  next();
});

exports.accessBodyVerification = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new appError(`please provide the email`, 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new appError(`invalid login info`, 404));
  }
  next();
});

exports.loginBodyVerification = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    next(new appError(`please provide the email and password`, 400));
  }
  next();
});

exports.protect = catchAsync(async (req, res, next) => {
  //1: get the token and check if its there or not
  console.log("entered");
  let token;
  //  console.log(req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) token = req.cookies.jwt;
  console.log(token);
  if (!token) {
    return next(
      new appError(`you do not have a token please login again!`, 400)
    );
  }

  //2: verification the token

  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
  console.log(decoded);

  //3: check if user still exist
  // const user = await User.findById(decoded.id);
  const currentUser = await User.findById(decoded.id);
  // console.log(currentUser);
  console.log("user hai: ", currentUser);
  if (!decoded || !currentUser) {
    return next(new appError(`invalid login info please login again`, 400));
  }

  console.log("body ye hai : ", req.body);

  // if (req.body.email) {
  //   if (req.body.email != currentUser.email) {
  //     return next(new appError("invalid token please login again", 400));
  //   }
  // }

  req.user = currentUser;

  //4:
  next();
});

exports.checkRole = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new appError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.isLoggedIn = async (req, res, next) => {
  try {
    //1: get the token and check if its there or not
    if (req.cookies.jwt) {
      //2: verification the token

      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.SECRET_KEY
      );
      console.log(decoded);

      //3: check if user still exist
      // const user = await User.findById(decoded.id);
      const currentUser = await User.findById(decoded.id);
      // console.log(currentUser);
      console.log("user hai: ", currentUser);
      if (!decoded || !currentUser) {
        return next();
      }

      // if (req.body.email) {
      //   if (req.body.email != currentUser.email) {
      //     return next();
      //   }
      // }

      res.locals.user = currentUser;
      return next();
    }
  } catch (error) {
    console.log(error);
  }
  next();
};

exports.logout = catchAsync(async (req, res) => {
  console.log("logout!!");
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
});
