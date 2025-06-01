document.addEventListener("DOMContentLoaded", () => {
  const fields = {
    inv_make: { min: 2, max: 50 },
    inv_model: { min: 2, max: 50 },
    inv_year: { min: 1900, max: 2030 },
    inv_description: { min: 2, max: 100 },
    inv_image: { required: true },
    inv_thumbnail: { required: true },
    inv_price: { min: 1 },
    inv_miles: { min: 1 },
    inv_color: { required: true },
  };

  for (const [name, rules] of Object.entries(fields)) {
    const input = document.querySelector(`[name="${name}"]`);
    const requirement = input?.nextElementSibling;

    if (!input || !requirement) continue;

    input.addEventListener("input", () => {
      let isValid = true;

      if ("min" in rules && input.type === "number") {
        const val = Number(input.value);
        if (isNaN(val) || val < rules.min || (rules.max && val > rules.max)) {
          isValid = false;
        }
      } else if ("min" in rules && input.type === "text" || input.tagName === "TEXTAREA") {
        const val = input.value.trim();
        if (val.length < rules.min || val.length > rules.max) {
          isValid = false;
        }
      } else if (rules.required && !input.value.trim()) {
        isValid = false;
      }

      requirement.classList.toggle("valid", isValid);
      requirement.classList.toggle("invalid", !isValid);
    });

    // Trigger validation once to show initial state
    input.dispatchEvent(new Event("input"));
  }

  // Special case for classification dropdown or radio
  const classification = document.querySelector(
    '[name="classification_id"], select[name="classification_id"]'
  );
  const classificationReq =
    classification?.parentElement.querySelector(".requirement");

  if (classification && classificationReq) {
    classification.addEventListener("change", () => {
      const valid = !!classification.value;
      classificationReq.classList.toggle("valid", valid);
      classificationReq.classList.toggle("invalid", !valid);
    });

    classification.dispatchEvent(new Event("change"));
  }
});
