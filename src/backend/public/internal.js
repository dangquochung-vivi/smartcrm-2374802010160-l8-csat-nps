(() => {
  const tokenKey = 'smartcrm_token';
  const roleLabels = {
    marketing: 'Marketing',
    support: 'Nhân viên CSKH',
    manager: 'Quản lý trung tâm'
  };

  async function apiFetch(url, options = {}) {
    const token = localStorage.getItem(tokenKey);
    const headers = new Headers(options.headers || {});
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
      localStorage.removeItem(tokenKey);
      window.location.replace('/login');
    }
    return response;
  }

  async function initializeInternalPage() {
    if (!localStorage.getItem(tokenKey)) {
      window.location.replace('/login');
      return false;
    }

    try {
      const response = await apiFetch('/auth/me');
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Không thể xác thực tài khoản');
      }
      if (result.data.role === 'customer') {
        window.location.replace('/customer');
        return false;
      }

      document.getElementById('currentUserName').textContent = result.data.name;
      document.getElementById('currentUserRole').textContent = roleLabels[result.data.role] || result.data.role;
      return true;
    } catch (error) {
      const status = document.getElementById('statusBadge') || document.getElementById('surveyMessage');
      if (status) status.textContent = `Lỗi xác thực: ${error.message}`;
      return false;
    }
  }

  const logoutButton = document.getElementById('logoutButton');
  logoutButton?.addEventListener('click', async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem(tokenKey);
      window.location.replace('/login');
    }
  });

  window.SmartCRM = { apiFetch, initializeInternalPage };
})();
