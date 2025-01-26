document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("surveyForm");
  const formState = {
    name: false,
    email: false,
    role: false,
    recommend: false,
    favorite: false,
    improvements: false,
    age: false
  };

  // Validation patterns
  const patterns = {
    name: /^[A-Za-z\s]{2,50}$/,
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    age: /^(?:[0-9]|[1-9][0-9]|1[0-1][0-9]|120)$/
  };

  // Debounce function for real-time validation
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Generic validation function
  function validateField(input, pattern, errorSpan, errorMessage) {
    const value = input.value.trim();
    const isValid = pattern ? pattern.test(value) : !!value;
    
    setFieldStatus(input, errorSpan, isValid, errorMessage);
    return isValid;
  }

  // Set field status (valid/invalid)
  function setFieldStatus(input, errorSpan, isValid, errorMessage) {
    if (!isValid) {
      input.style.border = "2px solid red";
      input.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
      errorSpan.textContent = errorMessage;
      errorSpan.style.color = "red";
    } else {
      input.style.border = "2px solid #4CAF50";
      input.style.backgroundColor = "rgba(76, 175, 80, 0.1)";
      errorSpan.textContent = "";
    }
  }

  // Reset field status on input
  function resetFieldStatus(input, errorSpan) {
    input.style.border = "";
    input.style.backgroundColor = "";
    errorSpan.textContent = "";
  }

  // Validate group inputs (radio/checkbox)
  function validateGroup(inputs, errorSpan, errorMessage) {
    const isValid = Array.from(inputs).some(input => input.checked);
    
    inputs.forEach(input => {
      input.style.outline = isValid ? "" : "2px solid red";
    });
    
    errorSpan.textContent = isValid ? "" : errorMessage;
    errorSpan.style.color = "red";
    
    return isValid;
  }

  // Add real-time validation listeners
  const addValidationListener = (input, pattern, errorSpan, errorMessage, stateKey) => {
    const validateWithDebounce = debounce(() => {
      formState[stateKey] = validateField(input, pattern, errorSpan, errorMessage);
    }, 300);

    input.addEventListener("input", validateWithDebounce);
    input.addEventListener("blur", () => {
      formState[stateKey] = validateField(input, pattern, errorSpan, errorMessage);
    });
  };

  // Setup field validations
  const name = document.getElementById("name");
  const nameError = document.getElementById("msg-error");
  addValidationListener(name, patterns.name, nameError, "Name must be 2-50 characters, letters only", "name");

  const email = document.getElementById("email");
  const emailError = email.nextElementSibling;
  addValidationListener(email, patterns.email, emailError, "Please enter a valid email address", "email");

  const age = document.getElementById('age');
  const ageError = age.nextElementSibling;
  addValidationListener(age, patterns.age, ageError, "Age must be between 0 and 120", "age");

  const role = document.getElementById("role");
  const roleError = role.nextElementSibling;
  role.addEventListener("change", () => {
    formState.role = validateField(role, null, roleError, "Please select a child's age group");
  });

  // Setup group validations
  const recommandations = document.getElementsByName("recommend");
  const radioError = document.querySelector(".radio-group").nextElementSibling;
  recommandations.forEach(radio => {
    radio.addEventListener("change", () => {
      formState.recommend = validateGroup(recommandations, radioError, "Please select an answer");
    });
  });

  const favorite = document.getElementById("favorite");
  const favoriteError = favorite.nextElementSibling;
  favorite.addEventListener("change", () => {
    formState.favorite = validateField(favorite, null, favoriteError, "Please select a favorite feature");
  });

  const improvements = document.querySelectorAll('input[name="improvements"]');
  const improvementsError = document.querySelector(".checkbox-group").nextElementSibling;
  improvements.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      formState.improvements = validateGroup(improvements, improvementsError, "Please select at least one improvement option");
    });
  });

  // Form submission handler
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Validate all fields
    formState.name = validateField(name, patterns.name, nameError, "Name must be 2-50 characters, letters only");
    formState.email = validateField(email, patterns.email, emailError, "Please enter a valid email address");
    formState.role = validateField(role, null, roleError, "Please select a child's age group");
    formState.recommend = validateGroup(recommandations, radioError, "Please select an answer");
    formState.favorite = validateField(favorite, null, favoriteError, "Please select a favorite feature");
    formState.improvements = validateGroup(improvements, improvementsError, "Please select at least one improvement option");

    // Check if age is provided and valid
    if (age.value && !patterns.age.test(age.value)) {
      formState.age = false;
      setFieldStatus(age, ageError, false, "Age must be between 0 and 120");
    }

    // Check if form is valid
    const isValid = Object.values(formState).every(state => state === true);

    if (isValid) {
      try {
        const formData = {
          name: name.value.trim(),
          email: email.value.trim(),
          age: age.value.trim() || undefined,
          role: role.value,
          recommend: Array.from(recommandations).find(r => r.checked)?.value,
          favoriteFeature: favorite.value,
          improvements: Array.from(improvements)
            .filter(imp => imp.checked)
            .map(imp => imp.value)
        };

        const response = await fetch("/api/v1/survey", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        alert("Form submitted successfully!");
        form.reset();
        
        // Reset all validation states
        Object.keys(formState).forEach(key => formState[key] = false);
        
        // Reset all field styles
        [name, email, age, role, favorite].forEach(input => {
          resetFieldStatus(input, input.nextElementSibling || document.getElementById("msg-error"));
        });
        
      } catch (error) {
        console.error("Submission error:", error);
        alert("An error occurred while submitting the form. Please try again.");
      }
    } else {
      // Scroll to the first error
      const firstError = document.querySelector('.error-message:not(:empty)');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
});
