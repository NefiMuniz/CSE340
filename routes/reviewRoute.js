const express = require("express");
const router = new express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities/");

// User can submit a review
router.post(
  "/add",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.submitReview)
);
// Employee and Admin can delete a review
router.post(
  "/delete/:review_id",
  utilities.checkAuthorizationManager,
  utilities.handleErrors(reviewController.deleteReview)
);

module.exports = router;
