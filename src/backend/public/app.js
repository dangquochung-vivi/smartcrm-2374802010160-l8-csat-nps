const tableBody = document.getElementById('surveyTableBody');
const reportInsights = document.getElementById('reportInsights');
const sideNavLinks = document.querySelectorAll('.side-nav a');
const createSurveyButton = document.getElementById('createSurveyButton');
const logoutButton = document.getElementById('logoutButton');
const tokenKey = 'smartcrm_token';
const roleLabels = { marketing: 'Marketing', support: 'Nhân viên CSKH', manager: 'Quản lý trung tâm' };
const metrics = {
  total: document.getElementById('totalSurveys'),
  avgCsat: document.getElementById('avgCsat'),
  avgNps: document.getElementById('avgNps'),
  happyRate: document.getElementById('happyRate'),
  status: document.getElementById('statusBadge')
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

async function fetchSurveys() {
  try {
    metrics.status.textContent = 'Đang tải...';

    const [listRes, statsRes] = await Promise.all([
      apiFetch('/surveys'),
      apiFetch('/surveys/stats')
    ]);

    const listResult = await listRes.json();
    const statsResult = await statsRes.json();

    if (!listRes.ok || !listResult.success) {
      throw new Error(listResult.error || 'Không thể tải danh sách khảo sát');
    }

    if (!statsRes.ok || !statsResult.success) {
      throw new Error(statsResult.error || 'Không thể tải thống kê');
    }

    renderMetrics(statsResult.data || { total: 0, avgCsat: 0, avgNps: 0, happyRate: 0 });
    renderInsights(listResult.data || []);
    renderTable(listResult.data || []);
    metrics.status.textContent = 'Hoạt động tốt';
  } catch (error) {
    metrics.status.textContent = 'Lỗi kết nối';
    tableBody.innerHTML = '<tr><td colspan="4" class="empty-row">Không thể tải dữ liệu: ' + error.message + '</td></tr>';
  }
}

function renderMetrics(stats) {
  const total = Number(stats.total || 0);
  const avgCsat = Number(stats.avgCsat || 0);
  const avgNps = Number(stats.avgNps || 0);
  const happyRate = Number(stats.happyRate || 0);

  metrics.total.textContent = String(total);
  metrics.avgCsat.textContent = avgCsat.toFixed(1);
  metrics.avgNps.textContent = avgNps.toFixed(1);
  metrics.happyRate.textContent = happyRate.toFixed(0) + '%';
}

function renderInsights(surveys) {
  if (!surveys.length) {
    reportInsights.innerHTML = '<div class="report-card"><span class="kicker">Điểm đánh giá</span><strong>0</strong><span>Chưa có dữ liệu</span></div>';
    return;
  }

  const total = surveys.length;
  const csat5 = surveys.filter((item) => Number(item.csat_score) === 5).length;
  const csat4 = surveys.filter((item) => Number(item.csat_score) === 4).length;
  const npsPromoters = surveys.filter((item) => Number(item.nps_score) >= 9).length;
  const avgNps = surveys.reduce((sum, item) => sum + Number(item.nps_score || 0), 0) / total;

  reportInsights.innerHTML = `
    <div class="report-card">
      <span class="kicker">Khách hàng hài lòng</span>
      <strong>${Math.round((csat5 / total) * 100)}%</strong>
      <span>CSAT = 5</span>
    </div>
    <div class="report-card">
      <span class="kicker">Khách hàng rất tốt</span>
      <strong>${Math.round((csat4 / total) * 100)}%</strong>
      <span>CSAT = 4</span>
    </div>
    <div class="report-card">
      <span class="kicker">Promoter</span>
      <strong>${Math.round((npsPromoters / total) * 100)}%</strong>
      <span>NPS ≥ 9</span>
    </div>
    <div class="report-card">
      <span class="kicker">NPS trung bình</span>
      <strong>${avgNps.toFixed(1)}</strong>
      <span>Điểm đánh giá trung bình</span>
    </div>
  `;
}

function renderTable(surveys) {
  if (!surveys.length) {
    tableBody.innerHTML = '<tr><td colspan="4" class="empty-row">Chưa có phản hồi nào.</td></tr>';
    return;
  }

  tableBody.innerHTML = surveys.map((item) => {
    const csat = Number(item.csat_score || 0);
    const nps = Number(item.nps_score || 0);
    const csatClass = csat >= 4 ? 'csat-good' : csat >= 3 ? 'csat-mid' : 'csat-bad';
    const npsClass = nps >= 7 ? 'nps-good' : 'csat-mid';

    return `
      <tr>
        <td><strong>${escapeHTML(item.ticket_code || 'N/A')}</strong></td>
        <td><span class="score-pill ${csatClass}">${csat}</span></td>
        <td><span class="score-pill ${npsClass}">${nps}</span></td>
        <td>${escapeHTML((item.feedback_content || 'Không có nhận xét').slice(0, 80))}</td>
      </tr>
    `;
  }).join('');
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

sideNavLinks.forEach((link) => {
  link.addEventListener('click', () => {
    sideNavLinks.forEach((item) => item.classList.toggle('active', item === link));
  });
});

createSurveyButton.addEventListener('click', () => {
  document.getElementById('surveySection').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

const form = document.getElementById('surveyForm');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const payload = {
    ticket_code: formData.get('ticket_code')?.toString().trim(),
    csat_score: Number(formData.get('csat_score')),
    nps_score: Number(formData.get('nps_score')),
    feedback_content: formData.get('feedback_content')?.toString().trim()
  };

  try {
    metrics.status.textContent = 'Đang lưu...';
    const response = await apiFetch('/surveys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Không thể lưu khảo sát');
    }

    form.reset();
    await fetchSurveys();
    metrics.status.textContent = 'Đã lưu khảo sát';
  } catch (error) {
    metrics.status.textContent = 'Lỗi lưu dữ liệu';
    alert(error.message);
  }
});

async function initializeDashboard() {
  if (!localStorage.getItem(tokenKey)) {
    window.location.replace('/login');
    return;
  }

  try {
    const response = await apiFetch('/auth/me');
    if (!response.ok) return;
    const result = await response.json();
    if (result.data.role === 'customer') {
      window.location.replace('/customer');
      return;
    }
    document.getElementById('currentUserName').textContent = result.data.name;
    document.getElementById('currentUserRole').textContent = roleLabels[result.data.role] || result.data.role;
    await fetchSurveys();
  } catch (error) {
    metrics.status.textContent = 'Lỗi xác thực';
  }
}

logoutButton.addEventListener('click', async () => {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } finally {
    localStorage.removeItem(tokenKey);
    window.location.replace('/login');
  }
});

initializeDashboard();
