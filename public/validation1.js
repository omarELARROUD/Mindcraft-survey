document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("surveyForm");

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission for validation
    let isValid = true; // Track overall form validity

    // Helper Function: Reset Error State
    function resetError(input, errorSpan) {
      input.addEventListener("input", function () {
        input.style.border = "";
        input.style.backgroundColor = "";
        errorSpan.textContent = "";
      });
    }
    function resetErrorInput(inputGroup, errorSpan) {
      // Add a change event listener to all inputs in the group
      inputGroup.forEach((input) => {
        input.addEventListener("change", function () {
          // If at least one checkbox is checked, clear the error
          const isChecked = Array.from(inputGroup).some(
            (checkbox) => checkbox.checked
          );
          if (isChecked) {
            inputGroup.forEach((checkbox) => (checkbox.style.outline = ""));
            errorSpan.textContent = "";
          }
        });
      });
    }

    // Validate Name
    const name = document.getElementById("name");
    const nameError = document.getElementById("msg-error");
    if (!name.value.trim()) {
      name.style.border = "1px solid red";
      name.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
      nameError.textContent = "Name is required.";
      nameError.style.color = "red";
      isValid = false;
      // } else if (name.value.length < 2 || name.value.length > 50) {
      //   name.style.border = '1px solid red';
      //   name.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
      //   nameError.textContent = 'Name must be between 2 and 50 characters.';
      //   nameError.style.color = 'red';
      //   isValid = false;
    } else {
      name.style.border = "";
      nameError.textContent = "";
    }
    resetError(name, nameError);

    // Validate Email
    const email = document.getElementById("email");
    const emailError = email.nextElementSibling;
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation regex
    if (!email.value.trim()) {
      email.style.border = "1px solid red";
      email.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
      emailError.textContent = "Email is required.";
      emailError.style.color = "red";
      isValid = false;
      // } else if (!emailRegex.test(email.value)) {
      //   email.style.border = '1px solid red';
      //   email.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
      //   emailError.textContent = 'Please enter a valid email address.';
      //   emailError.style.color = 'red';
      //   isValid = false;
    } else {
      email.style.border = "";
      emailError.textContent = "";
    }
    resetError(email, emailError);

    // Validate Age (Optional)
    const age = document.getElementById('age');
    // const ageError = age.nextElementSibling;
    // if (age.value && (age.value < 0 || age.value > 120)) {
    //   age.style.border = '1px solid red';
    //   age.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
    //   ageError.textContent = 'Age must be between 0 and 120.';
    //   ageError.style.color = 'red';
    //   isValid = false;
    // } else {
    //   age.style.border = '';
    //   ageError.textContent = '';
    // }
    // resetError(age, ageError);

    // Validate Child's Age Group (Role)
    const role = document.getElementById("role");
    const roleError = role.nextElementSibling;
    if (!role.value) {
      role.style.border = "1px solid red";
      role.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
      roleError.textContent = "Please select a child's age group.";
      roleError.style.color = "red";
      isValid = false;
    } else {
      role.style.border = "";
      roleError.textContent = "";
    }
    resetError(role, roleError);

    // Validate Recommandation
    let selected = false;
    const recommandations = document.getElementsByName("recommend");
    const radioError =
      document.querySelector(".radio-group").nextElementSibling;
    console.log(radioError);
    for (const radio of recommandations) {
      if (radio.checked) {
        selected = true;
        break;
      }
    }
    // Set error if no radio is selected
    if (!selected) {
      isValid = false;
      for (const radio of recommandations) {
        radio.style.outline = "1px solid red";
      }
      radioError.textContent = "Please select a answare from above.";
      radioError.style.color = "red";
    } else {
      radioError.textContent = "";
      for (const radio of recommandations) {
        radio.style.outline = "none";
      }
    }
    resetErrorInput(recommandations, radioError);

    // Validate Favorite Feature
    const favorite = document.getElementById("favorite");
    const favoriteError = favorite.nextElementSibling;
    if (!favorite.value) {
      favorite.style.border = "1px solid red";
      favorite.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
      favoriteError.textContent = "Please select a favorite feature.";
      favoriteError.style.color = "red";
      isValid = false;
    } else {
      favorite.style.border = "";
      favoriteError.textContent = "";
    }
    resetError(favorite, favoriteError);

    // Validate Improvements
    const checkboxes = document.querySelectorAll(
      'input[name="improvements"]:checked'
    ); // Get checked checkboxes
    const errorSpan =
      document.querySelector(".checkbox-group").nextElementSibling;
    const checkboxesGroup = document.querySelectorAll(
      'input[name="improvements"]'
    );
    if (checkboxes.length === 0) {
      errorSpan.textContent = "Please select at least one improvement option."; // Set error message
      errorSpan.style.color = "red";

      // Highlight checkboxes with an outline
      checkboxesGroup.forEach((checkbox) => {
        checkbox.style.outline = "2px solid red"; // Set a red outline for each unchecked checkbox
      });
      isValid = false;
    } else {
      errorSpan.textContent = ""; // Clear the error message
      checkboxes.forEach((checkbox) => {
        checkbox.style.outline = ""; // Remove the outline for each checked checkbox
      });
    }
    resetErrorInput(checkboxesGroup, errorSpan);

    // Final Submission Check
    if (isValid) {
      // Collect form data into an object
      const formData = {
        name: name.value,
        email: email.value,
        age: age.value.length?age.value:undefined,
        role: role.value,
        favoriteFeature: favorite.value,
      };

      // Send POST request using fetch
      try {
        const response = await fetch("/api/v1/survey", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const result = await response.json();
          alert("Form submitted successfully!");
          form.reset();
          console.log(result); // Handle the server response (e.g., show confirmation, handle data)
        } else {
          const errorResult = await response.json();
          alert("Failed to submit the form: " + errorResult.message);
        }
      } catch (error) {
        console.error("Error submitting the form:", error);
        alert("There was an error submitting the form.");
      }
    }
  });
});
