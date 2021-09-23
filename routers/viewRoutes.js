const express = require("express");
const viewRouter = express.Router();
const viewController = require("../controller/viewController");
const userMiddleware = require("../middlewares/userMiddleware");

// viewRouter.get("/", (req, res) => {
//   res.status(200).render("base", {
//     tour: "Hunza Khanjraab",
//     user: "umair ali",
//   });
// });

viewRouter.use(userMiddleware.isLoggedIn);

viewRouter.get("/", viewController.getOverview);
viewRouter.get("/login", viewController.getLoginTour);
viewRouter.get("/signup", viewController.getSignupTour);
viewRouter.get("/tour/:slug", userMiddleware.protect, viewController.getTour);
viewRouter.get("/me", userMiddleware.protect, viewController.getAccount);
// viewRouter.post(
//   "/submit-user-data",
//   userMiddleware.protect,
//   viewController.updateUserData
// );

module.exports = viewRouter;
