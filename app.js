const express = require("express");
const path = require("path");
const userRouter = require("./routers/userRoutes");
const tourRouter = require("./routers/tourRoutes");
const reviewRouter = require("./routers/reviewRoutes");
const viewRouter = require("./routers/viewRoutes");
const bookingRouter = require("./routers/bookingRoutes");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const appError = require("./controller/appError");
const globalErrorHandler = require("./controller/errorController");
const cookieParser = require("cookie-parser");

//start express app
const app = express();

//server side rendering template engine pug set
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//global middleware
app.use(express.static(path.join(__dirname, "public")));

app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// data sanitization against noSql queries injection
app.use(mongoSanitize());

//data sanitization against XSS
app.use(xss());

//Routes

//set the limit of api requests
const limit = rateLimit({
  max: 50,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests for this IP, please try again in an hour!",
});

app.use("/api", limit);

app.use(compression());

app.use((req, res, next) => {
  console.log(req.cookies);
  next();
});
const port = process.env.PORT || 7000;

app.use("/", viewRouter);
app.use("/api/u1/users", userRouter);
app.use("/api/t1/tours", tourRouter);
app.use("/api/r1/reviews", reviewRouter);
app.use("/api/b1/booking", bookingRouter);

app.all("*", (req, res, next) => {
  return next(new appError(`can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = { app, port };
