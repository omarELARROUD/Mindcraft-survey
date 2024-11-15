document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('surveyForm');
    
    // Validation rules
    const validateField = (field) => {
      const value = field.value.trim();
      let isValid = true;
      let errorMessage = '';
  
      switch(field.id) {
        case 'name':
          if (!value) {
            isValid = false;
            errorMessage = 'Name is required';
          } else if (value.length < 2 || value.length > 50) {
            isValid = false;
            errorMessage = 'Name must be between 2 and 50 characters';
          }
          break;
  
        case 'email':
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!value) {
            isValid = false;
            errorMessage = 'Email is required';
          } else if (!emailPattern.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
          }
          break;
  
        case 'age':
          if (value) { // Only validate if age is provided (optional field)
            const age = parseInt(value);
            if (isNaN(age) || age < 0 || age > 120) {
              isValid = false;
              errorMessage = 'Age must be between 0 and 120';
            }
          }
          break;
  
        case 'role':
          if (!value) {
            isValid = false;
            errorMessage = "Please select your child's age group";
          }
          break;
  
        case 'favorite':
          if (!value) {
            isValid = false;
            errorMessage = 'Please select your favorite feature';
          }
          break;
      }
  
      // Check radio buttons for 'recommend'
      if (field.name === 'recommend') {
        const recommendChecked = form.querySelector('input[name="recommend"]:checked');
        if (!recommendChecked) {
          isValid = false;
          errorMessage = 'Please select a recommendation option';
        }
      }
  
      return { isValid, errorMessage };
    };
  
    // Show error message for a field
    const showError = (field, message) => {
      field.classList.add('error');
      const errorElement = field.parentElement.querySelector('.error-message');
      if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('visible');
      }
    };
  
    // Clear error message for a field
    const clearError = (field) => {
      field.classList.remove('error');
      const errorElement = field.parentElement.querySelector('.error-message');
      if (errorElement) {
        errorElement.classList.remove('visible');
      }
    };
  
    // Form submission handler
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      let formIsValid = true;
  
      // Clear all previous errors
      form.querySelectorAll('.error').forEach(field => {
        clearError(field);
      });
  
      // Validate all required fields
      const fieldsToValidate = ['name', 'email', 'role', 'favorite'];
      fieldsToValidate.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const { isValid, errorMessage } = validateField(field);
        if (!isValid) {
          formIsValid = false;
          showError(field, errorMessage);
        }
      });
  
      // Validate age if provided
      const ageField = document.getElementById('age');
      if (ageField.value) {
        const { isValid, errorMessage } = validateField(ageField);
        if (!isValid) {
          formIsValid = false;
          showError(ageField, errorMessage);
        }
      }
  
      // Validate recommend radio buttons
      const recommendField = form.querySelector('input[name="recommend"]');
      const { isValid, errorMessage } = validateField(recommendField);
      if (!isValid) {
        formIsValid = false;
        showError(recommendField, errorMessage);
      }
  
      if (formIsValid) {
        // Form is valid - you can submit it here
        alert('Survey submitted successfully!');
        form.reset();
        // Clear any remaining error states
        form.querySelectorAll('.error').forEach(field => {
          clearError(field);
        });
      }
    });
  });