const reportInsights = document.getElementById('reportInsights');
const metrics = {
  total: document.getElementById('totalSurveys'),
  avgCsat: document.getElementById('avgCsat'),
  avgNps: document.getElementById('avgNps'),
  happyRate: document.getElementById('happyRate'),
  status: document.getElementById('statusBadge')
};

function renderMetrics(stats) {
  metrics.total.textContent = String(Number(stats.total || 0));
  metrics.avgCsat.textContent = Number(stats.avgCsat || 0).toFixed(1);
  metrics.avgNps.textContent = Number(stats.avgNps || 0).toFixed(1);
  metrics.happyRate.textContent = `${Number(stats.happyRate || 0).toFixed(0)}%`;
}

function renderInsights(surveys) {
  const total = surveys.length;
  if (!total) {
    reportInsights.innerHTML = '<div class="report-card"><span class="kicker">Đánh giá khách hàng</span><strong>0</strong><span>Chưa có dữ liệu</span></div>';
    return;
  }

  const csat5 = surveys.filter((item) => Number(item.csat_score) === 5).length;
  const csat4 = surveys.filter((item) => Number(item.csat_score) === 4).length;
  const promoters = surveys.filter((item) => Number(item.nps_score) >= 9).length;
  const avgNps = surveys.reduce((sum, item) => sum + Number(item.nps_score || 0), 0) / total;
  reportInsights.innerHTML = `
    <div class="report-card"><span class="kicker">Khách hàng rất hài lòng</span><strong>${Math.round(csat5 / total * 100)}%</strong><span>CSAT = 5</span></div>
    <div class="report-card"><span class="kicker">Khách hàng hài lòng</span><strong>${Math.round(csat4 / total * 100)}%</strong><span>CSAT = 4</span></div>
    <div class="report-card"><span class="kicker">Promoter</span><strong>${Math.round(promoters / total * 100)}%</strong><span>NPS ≥ 9</span></div>
    <div class="report-card"><span class="kicker">NPS trung bình</span><strong>${avgNps.toFixed(1)}</strong><span>Điểm đánh giá trung bình</span></div>
  `;
}

async function loadDashboard() {
  if (!await window.SmartCRM.initializeInternalPage()) return;

  try {
    const [surveysResponse, statsResponse] = await Promise.all([
      window.SmartCRM.apiFetch('/surveys'),
      window.SmartCRM.apiFetch('/surveys/stats')
    ]);
    const [surveysResult, statsResult] = await Promise.all([
      surveysResponse.json(),
      statsResponse.json()
    ]);
    if (!surveysResponse.ok || !surveysResult.success) {
      throw new Error(surveysResult.error || 'Không thể tải khảo sát');
    }
    if (!statsResponse.ok || !statsResult.success) {
      throw new Error(statsResult.error || 'Không thể tải thống kê');
    }

    renderMetrics(statsResult.data);
    renderInsights(surveysResult.data || []);
    metrics.status.textContent = 'Dữ liệu đã được cập nhật';
  } catch (error) {
    metrics.status.textContent = `Không thể tải dữ liệu: ${error.message}`;
  }
}

loadDashboard();
