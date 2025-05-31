const passwordInput = document.querySelector("#password");
const passwordHide = document.querySelector("#passwordHide");

const lengthReq = document.getElementById("length");
const uppercaseReq = document.getElementById("uppercase");
const lowercaseReq = document.getElementById("lowercase");
const numberReq = document.getElementById("number");
const specialReq = document.getElementById("special");

passwordInput.addEventListener("input", () => {
  const value = passwordInput.value;

  lengthReq.classList.toggle("valid", value.length >= 12);
  lengthReq.classList.toggle("invalid", value.length < 12);

  uppercaseReq.classList.toggle("valid", /[A-Z]/.test(value));
  uppercaseReq.classList.toggle("invalid", !/[A-Z]/.test(value));

  lowercaseReq.classList.toggle("valid", /[a-z]/.test(value));
  lowercaseReq.classList.toggle("invalid", !/[a-z]/.test(value));

  numberReq.classList.toggle("valid", /\d/.test(value));
  numberReq.classList.toggle("invalid", !/\d/.test(value));

  specialReq.classList.toggle("valid", /[^\w\s]/.test(value));
  specialReq.classList.toggle("invalid", !/[^\w\s]/.test(value));
});

document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("password");
  const toggleBtn = document.getElementById("togglePassword");

  if (passwordInput && toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
      toggleBtn.textContent = isHidden ? "🙈" : "👁️";
    });

    toggleBtn.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        toggleBtn.click();
      }
    });
  }
});
