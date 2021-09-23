const appError = require("./appError");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //operation trusted errors send to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log("Error 😟", err);
    res.status(500).json({
      status: "error",
      message: "something went wrong!",
    });
  }
};

const HandleCastError = (err, res) => {
  const message = `Invalid ${err.path}: ${err.val} `;
  return new appError(message, 404);
};

module.exports = (err, req, res, next) => {
  //console.log(err.stack);
  console.log("statuscode is ", +err.statusCode);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {
    console.log("agye development me");
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    console.log("agaye production error me");
    let error = { ...err };
    if (error.name === "CastError") error = HandleCastError(error);

    sendErrorProd(error, res);
  }
  // console.log(err.status);
  // console.log(err.statusCode);
  // console.log(err.message);
};
