document.addEventListener("DOMContentLoaded", function () {
  const input = document.querySelector('input[name="classification_name"]');
  const requirement = document.querySelector(".requirement");

  // Function to check validity and toggle classes
  function validateInput() {
    if (input.checkValidity()) {
      requirement.classList.remove("invalid");
      requirement.classList.add("valid");
    } else {
      requirement.classList.remove("valid");
      requirement.classList.add("invalid");
    }
  }

  // Initial validation
  validateInput();

  // Re-validate on user input
  input.addEventListener("input", validateInput);
});
