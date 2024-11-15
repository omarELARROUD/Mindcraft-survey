// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('surveyForm');

    // Function to show error message
    function showError(field, message) {
        // Add red border
        field.classList.add('error');
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'block';
            errorElement.textContent = message;
        } else {
            // If .error-message doesn't exist, create one
            const newErrorElement = document.createElement('span');
            newErrorElement.className = 'error-message';
            newErrorElement.style.display = 'block';
            newErrorElement.textContent = message;
            field.parentElement.appendChild(newErrorElement);
        }
    }

    // Function to hide error message
    function hideError(field) {
        field.classList.remove('error');
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        let isValid = true;

        // Clear all previous errors
        document.querySelectorAll('.error-message').forEach(error => {
            error.style.display = 'none';
        });
        document.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });

        // Validate name (required, min length 2)
        const name = document.getElementById('name');
        if (!name.value.trim()) {
            showError(name, 'Name is required');
            isValid = false;
        } else if (name.value.length < 2) {
            showError(name, 'Name must be at least 2 characters');
            isValid = false;
        }

        // Validate email (required, basic format)
        const email = document.getElementById('email');
        if (!email.value.trim()) {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!email.value.includes('@')) {
            showError(email, 'Please enter a valid email');
            isValid = false;
        }

        // Validate age (optional, between 0-120)
        const age = document.getElementById('age');
        if (age.value && (age.value < 0 || age.value > 120)) {
            showError(age, 'Age must be between 0 and 120');
            isValid = false;
        }

        // Validate child's age group (required)
        const role = document.getElementById('role');
        if (!role.value) {
            showError(role, "Please select your child's age group");
            isValid = false;
        }

        // Validate recommendation (radio buttons)
        const recommend = document.querySelector('input[name="recommend"]:checked');
        if (!recommend) {
            const recommendField = document.querySelector('input[name="recommend"]');
            showError(recommendField, 'Please select a recommendation');
            isValid = false;
        }

        // Validate favorite feature (required)
        const favorite = document.getElementById('favorite');
        if (!favorite.value) {
            showError(favorite, 'Please select your favorite feature');
            isValid = false;
        }

        if (isValid) {
            alert('Form submitted successfully!');
            form.reset();
        }
    });
});
