const express = require("express");
const reviewController = require("../controller/reviewController");
const userMiddleware = require("../middlewares/userMiddleware");

const reviewRouter = express.Router();
const router = express.Router({ mergeParams: true });

reviewRouter.use(userMiddleware.protect);

reviewRouter
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    userMiddleware.checkRole("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

reviewRouter
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    userMiddleware.checkRole("user", "admin"),
    reviewController.updateReview
  )
  .delete(
    userMiddleware.checkRole("user", "admin"),
    reviewController.deleteReview
  );

module.exports = reviewRouter;
