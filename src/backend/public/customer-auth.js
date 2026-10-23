const form = document.querySelector('#customerLoginForm, #customerRegisterForm');
const errorMessage = document.getElementById('customerAuthError');
const isRegistration = form.id === 'customerRegisterForm';

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorMessage.textContent = '';
  const values = Object.fromEntries(new FormData(form));
  const endpoint = isRegistration ? '/auth/register' : '/auth/login';
  const payload = isRegistration
    ? { name: values.name.trim(), email: values.email.trim(), password: values.password }
    : { username: values.email.trim(), password: values.password };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.error || 'Không thể xử lý yêu cầu');

    localStorage.setItem('smartcrm_token', result.data.token);
    window.location.replace('/customer');
  } catch (error) {
    errorMessage.textContent = error.message;
  }
});