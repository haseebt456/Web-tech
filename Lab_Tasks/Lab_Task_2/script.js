document.getElementById("checkoutForm").addEventListener("submit", handleFormSubmition);

function handleFormSubmition(e) {
    const form = e.target;
    let isValid = true;
  
    const fields = form.querySelectorAll("input, textarea");
    fields.forEach(field => {
      const errorSpan = field.nextElementSibling;
      errorSpan.textContent = "";
      field.classList.remove("invalid");
  
      if (!field.checkValidity()) {
        isValid = false;
        field.classList.add("invalid");
  
        if (field.validity.valueMissing) {
          errorSpan.textContent = "This field is required.";
        } else if (field.validity.patternMismatch) {
          if (field.id === "fullName") errorSpan.textContent = "Only letters allowed.";
          if (field.id === "phone") errorSpan.textContent = "Phone must be 10–15 digits.";
          if (field.id === "cardNumber") errorSpan.textContent = "Must be 16 digits.";
          if (field.id === "cvv") errorSpan.textContent = "Must be 3 digits.";
        } else if (field.validity.typeMismatch && field.type === "email") {
          errorSpan.textContent = "Invalid email format.";
        }
      }
  
    });
  
    if (!isValid) {
      e.preventDefault();
    } else {
      alert("Order placed successfully!");
      form.reset();
      fields.forEach(f => {
        f.classList.remove("invalid");
        f.nextElementSibling.textContent = "";
      });
    }
  }
  