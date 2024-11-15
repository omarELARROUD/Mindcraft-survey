// public/script.js
const form = document.getElementById('surveyForm');

form.addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent form submission if invalid

  // Reset previous error states
  clearErrors();

  if (!form.checkValidity()) {
    // Prevent actual submission if there are invalid fields
    form.classList.add('submitted');
    return;
  }
  // Collect form data
  const formData = new FormData(event.target);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    age: formData.get('age') ? parseInt(formData.get('age')) : null,
    childAgeGroup: formData.get('role'),
    recommend: formData.get('recommend'),
    favoriteFeature: formData.get('favorite'),
    improvements: [...formData.getAll('improvements')],
    comments: formData.get('comments')
  };

  try {
    // Choose API version based on configuration
    const apiVersion = process.env.STORAGE_VERSION;
    const response = await fetch(`/api/${apiVersion}/survey`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.errors ? formatErrors(result.errors) : 'Failed to submit survey');
    }

    // Show success message
    showMessage('Survey submitted successfully!', 'success');
    event.target.reset();
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => {
    el.style.display = 'none';
  });
}

function formatErrors(errors) {
  return errors.map(err => err.msg).join('\n');
}

function showMessage(message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  
  const container = document.querySelector('.container');
  container.insertBefore(messageDiv, container.firstChild);
  
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}