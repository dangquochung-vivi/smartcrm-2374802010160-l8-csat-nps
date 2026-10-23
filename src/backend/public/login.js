const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const demoAccounts = document.getElementById('demoAccounts');
const roleLabels = {
  marketing: 'Marketing',
  support: 'Nhân viên CSKH',
  manager: 'Quản lý'
};

async function signIn(endpoint, payload) {
  loginError.textContent = '';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Không thể đăng nhập');
  }

  localStorage.setItem('smartcrm_token', result.data.token);
  window.location.replace(result.data.user.role === 'customer' ? '/customer' : '/');
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);

  try {
    await signIn('/auth/login', {
      username: formData.get('username').toString().trim(),
      password: formData.get('password').toString()
    });
  } catch (error) {
    loginError.textContent = error.message;
  }
});

async function loadDemoAccounts() {
  try {
    const response = await fetch('/auth/demo-accounts');
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error('Không tải được tài khoản demo');

    result.data.forEach((account) => {
      const button = document.createElement('button');
      button.className = 'demo-account';
      button.type = 'button';
      button.innerHTML = `<span class="demo-avatar">${account.name.slice(0, 1)}</span><span class="demo-account-copy"><strong>${account.name}</strong><small>${roleLabels[account.role] || account.role}</small></span><span class="demo-arrow" aria-hidden="true">↗</span>`;
      button.addEventListener('click', async () => {
        button.disabled = true;
        try {
          await signIn('/auth/demo-login', { username: account.username });
        } catch (error) {
          loginError.textContent = error.message;
          button.disabled = false;
        }
      });
      demoAccounts.appendChild(button);
    });
  } catch (error) {
    loginError.textContent = error.message;
  }
}

loadDemoAccounts();