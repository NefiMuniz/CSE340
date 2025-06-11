function validateReviewForm() {
  const text = document.getElementById("review_text").value.trim();

  if (text.length < 3) {
    alert("Review must be at least 3 characters.");
    return false;
  }

  return true;
}
