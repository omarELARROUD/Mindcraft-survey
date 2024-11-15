document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('surveyForm');
  
    form.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent form submission for validation
      let isValid = true; // Track overall form validity
  
      // Helper Function: Reset Error State
      function resetError(input, errorSpan) {
        input.addEventListener('input', function () {
          input.style.border = '';
          input.style.backgroundColor = '';
          errorSpan.textContent = '';
        });
      }
  
      // Validate Name
      const name = document.getElementById('name');
      const nameError = document.getElementById('msg-error');
      if (!name.value.trim()) {
        name.style.border = '1px solid red';
        name.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        nameError.textContent = 'Name is required.';
        nameError.style.color = 'red';
        isValid = false;
      } else if (name.value.length < 2 || name.value.length > 50) {
        name.style.border = '1px solid red';
        name.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        nameError.textContent = 'Name must be between 2 and 50 characters.';
        nameError.style.color = 'red';
        isValid = false;
      } else {
        name.style.border = '';
        nameError.textContent = '';
      }
      resetError(name, nameError);
  
      // Validate Email
      const email = document.getElementById('email');
      const emailError = email.nextElementSibling;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation regex
      if (!email.value.trim()) {
        email.style.border = '1px solid red';
        email.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        emailError.textContent = 'Email is required.';
        emailError.style.color = 'red';
        isValid = false;
      } else if (!emailRegex.test(email.value)) {
        email.style.border = '1px solid red';
        email.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        emailError.textContent = 'Please enter a valid email address.';
        emailError.style.color = 'red';
        isValid = false;
      } else {
        email.style.border = '';
        emailError.textContent = '';
      }
      resetError(email, emailError);
  
      // Validate Age (Optional)
      const age = document.getElementById('age');
      const ageError = age.nextElementSibling;
      if (age.value && (age.value < 0 || age.value > 120)) {
        age.style.border = '1px solid red';
        age.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        ageError.textContent = 'Age must be between 0 and 120.';
        ageError.style.color = 'red';
        isValid = false;
      } else {
        age.style.border = '';
        ageError.textContent = '';
      }
      resetError(age, ageError);
  
      // Validate Child's Age Group (Role)
      const role = document.getElementById('role');
      const roleError = role.nextElementSibling;
      if (!role.value) {
        role.style.border = '1px solid red';
        role.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        roleError.textContent = 'Please select a child\'s age group.';
        roleError.style.color = 'red';
        isValid = false;
      } else {
        role.style.border = '';
        roleError.textContent = '';
      }
      resetError(role, roleError);
  
      // Validate Recommend Radio Buttons
      const recommend = document.querySelectorAll('input[name="recommend"]');
      const recommendError = document.querySelector('.radio-group + .error-message');
      if (![...recommend].some(radio => radio.checked)) {
        recommendError.textContent = 'Please select an option.';
        recommendError.style.color = 'red';
        isValid = false;
      } else {
        recommendError.textContent = '';
      }
  
      // Validate Favorite Feature
      const favorite = document.getElementById('favorite');
      const favoriteError = favorite.nextElementSibling;
      if (!favorite.value) {
        favorite.style.border = '1px solid red';
        favorite.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        favoriteError.textContent = 'Please select a favorite feature.';
        favoriteError.style.color = 'red';
        isValid = false;
      } else {
        favorite.style.border = '';
        favoriteError.textContent = '';
      }
      resetError(favorite, favoriteError);
  
      // Final Submission Check
      if (isValid) {
        alert('Form submitted successfully!');
        form.submit(); // Uncomment this line if the form needs to be submitted to a server
      }
    });
  });
  