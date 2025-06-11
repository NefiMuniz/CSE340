const reviewModel = require("../models/review-model");
const utilities = require("../utilities/");

async function submitReview(req, res) {
  const { review_text, inv_id } = req.body;
  const account_id = res.locals.accountData.account_id;

  const trimmedText = review_text?.trim();

  if (!trimmedText || trimmedText.length < 3) {
    req.flash("notice", "Review must be at least 3 characters long.");
    return res.status(400).redirect(`/inv/detail/${inv_id}`);
  }

  try {
    await reviewModel.addReview(review_text, inv_id, account_id);
    req.flash("notice", "Review submitted!");
  } catch (error) {
    console.error("Review submission failed:", error);
    req.flash("notice", "There was an error submitting your review.");
  }

  res.redirect(`/inv/detail/${inv_id}`);
}

async function deleteReview(req, res) {
  const review_id = parseInt(req.params.review_id);
  const { inv_id } = req.query;
  const accountType = res.locals.accountData.account_type;

  if (!["Admin", "Employee"].includes(accountType)) {
    req.flash("notice", "You are not authorized to delete reviews.");
    return res.redirect(`/inv/detail/${inv_id}`);
  }

  try {
    await reviewModel.deleteReviewById(review_id);
    req.flash("notice", "Review deleted successfully.");
  } catch (error) {
    console.error("Review deletion failed:", error);
    req.flash("notice", "Error deleting review.");
  }

  res.redirect(`/inv/detail/${inv_id}`);
}

module.exports = {
  submitReview,
  deleteReview,
};