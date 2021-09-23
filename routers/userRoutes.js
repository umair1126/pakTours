const express = require("express");
const userController = require("../controller/userController");
const userMiddleware = require("../middlewares/userMiddleware");

const userRouter = express.Router();

userRouter.get("/logout", userMiddleware.logout);
userRouter.route("/").get(userController.getUsers);
userRouter
  .route("/:id")
  .get(userController.getUserWithId)
  .delete(userController.deleteUserWithId);
userRouter
  .route("/signup")
  .post(userMiddleware.signupBodyVerification, userController.signUp);
userRouter
  .route("/accessverification")
  .post(
    userMiddleware.accessBodyVerification,
    userMiddleware.protect,
    userMiddleware.checkRole,
    userController.accessVerification
  );

userRouter
  .route("/login")
  .post(userMiddleware.loginBodyVerification, userController.Login);

userRouter.route("/forgetpassword").post(userController.forgetPassword);

userRouter.route("/resetpassword/:token").patch(userController.resetPassword);

userRouter
  .route("/updateme")
  .patch(
    userMiddleware.protect,
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe
  );

userRouter
  .route("/updatepassword")
  .patch(userMiddleware.protect, userController.updatePassword);

userRouter
  .route("/updateuserdata")
  .patch(userMiddleware.protect, userController.updateUserData);

userRouter
  .route("/deleteuser")
  .delete(userMiddleware.protect, userController.deleteUser);

module.exports = userRouter;
