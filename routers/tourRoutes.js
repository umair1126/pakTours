const express = require("express");
const tourController = require("../controller/tourController");
const reviewController = require("../controller/reviewController");
const userMiddleware = require("../middlewares/userMiddleware");
const reviewRouter = require("./reviewRoutes");
const tourRouter = express.Router();

// tourRouter.param('id', tourController.checkID);

tourRouter.use("/:tourId/reviews", reviewRouter);

tourRouter
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

tourRouter.route("/tour-stats").get(tourController.getTourStats);
tourRouter.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

tourRouter
  .route("/")
  .get(tourController.getAllTours)
  .post(
    userMiddleware.protect,
    userMiddleware.checkRole("admin", "lead-guide"),
    tourController.createTour
  );

tourRouter
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    userMiddleware.protect,
    userMiddleware.checkRole("admin", "lead-guide"),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    userMiddleware.protect,
    userMiddleware.checkRole("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = tourRouter;
