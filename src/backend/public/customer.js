const tokenKey = 'smartcrm_token';
const surveyForm = document.getElementById('customerSurveyForm');
const surveyMessage = document.getElementById('customerSurveyMessage');
const submitButton = document.getElementById('submitCustomerSurvey');

async function customerFetch(url, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${localStorage.getItem(tokenKey) || ''}`);
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    localStorage.removeItem(tokenKey);
    window.location.replace('/customer/login');
  }
  return response;
}

async function initializeCustomerPage() {
  if (!localStorage.getItem(tokenKey)) {
    window.location.replace('/customer/login');
    return;
  }

  const response = await customerFetch('/auth/me');
  if (!response.ok) return;
  const result = await response.json();
  if (result.data.role !== 'customer') {
    window.location.replace('/');
    return;
  }
  document.getElementById('customerGreeting').textContent = result.data.name;
}

document.getElementById('customerLogout').addEventListener('click', async () => {
  try {
    await customerFetch('/auth/logout', { method: 'POST' });
  } finally {
    localStorage.removeItem(tokenKey);
    window.location.replace('/customer/login');
  }
});

surveyForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  surveyMessage.textContent = 'Đang gửi đánh giá...';
  const values = Object.fromEntries(new FormData(surveyForm));

  try {
    const response = await customerFetch('/surveys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticket_code: values.ticket_code.trim(),
        csat_score: Number(values.csat_score),
        nps_score: Number(values.nps_score),
        feedback_content: values.feedback_content.trim()
      })
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.error || 'Không thể gửi đánh giá');
    surveyForm.reset();
    surveyMessage.textContent = 'Cảm ơn bạn đã gửi đánh giá. Phản hồi của bạn đã được ghi nhận.';
  } catch (error) {
    surveyMessage.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
});

initializeCustomerPage().catch(() => {
  surveyMessage.textContent = 'Không thể xác minh tài khoản. Vui lòng đăng nhập lại.';
});