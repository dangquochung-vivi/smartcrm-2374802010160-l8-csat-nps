const surveyTableBody = document.getElementById('surveyTableBody');
const statusBadge = document.getElementById('statusBadge');
const surveySearchForm = document.getElementById('surveySearchForm');
const surveySearchInput = document.getElementById('surveySearchInput');

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Không rõ' : date.toLocaleString('vi-VN');
}

function renderSurveys(surveys, search) {
  if (!surveys.length) {
    const message = search
      ? 'Không tìm thấy phản hồi phù hợp với thông tin tìm kiếm.'
      : 'Chưa có khách hàng gửi khảo sát nào.';
    surveyTableBody.innerHTML = `<tr><td colspan="7" class="empty-row">${message}</td></tr>`;
    return;
  }

  surveyTableBody.innerHTML = surveys.map((item) => {
    const csat = Number(item.csat_score);
    const hasNps = item.nps_score !== null && item.nps_score !== undefined;
    const nps = hasNps ? Number(item.nps_score) : null;
    const csatClass = csat >= 4 ? 'csat-good' : csat >= 3 ? 'csat-mid' : 'csat-bad';
    const npsClass = !hasNps ? '' : nps >= 9 ? 'nps-good' : nps >= 7 ? 'csat-mid' : 'csat-bad';
    return `
      <tr>
        <td>${escapeHTML(formatDate(item.created_at))}</td>
        <td><strong>${escapeHTML(item.ticket_code || 'N/A')}</strong></td>
        <td>${escapeHTML(item.customer_name || 'Không có thông tin')}</td>
        <td>${escapeHTML(item.customer_phone || 'Không có thông tin')}</td>
        <td><span class="score-pill ${csatClass}">${csat}</span></td>
        <td>${hasNps ? `<span class="score-pill ${npsClass}">${nps}</span>` : '—'}</td>
        <td>${escapeHTML(item.feedback_content || 'Không có nhận xét')}</td>
      </tr>
    `;
  }).join('');
}

async function loadSurveys(search = surveySearchInput.value.trim()) {
  if (!await window.SmartCRM.initializeInternalPage()) return;

  try {
    statusBadge.textContent = 'Đang tìm kiếm...';
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    const response = await window.SmartCRM.apiFetch(`/surveys${query.size ? `?${query}` : ''}`);
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Không thể tải danh sách khảo sát');
    }
    renderSurveys(result.data || [], search);
    statusBadge.textContent = `${(result.data || []).length} khảo sát`;
    if (search) {
      statusBadge.textContent = `Tìm thấy ${(result.data || []).length} khảo sát`;
    }
    if (new URLSearchParams(window.location.search).has('created')) {
      statusBadge.textContent = 'Đã lưu khảo sát mới';
    }
  } catch (error) {
    statusBadge.textContent = 'Lỗi tải dữ liệu';
    surveyTableBody.innerHTML = `<tr><td colspan="7" class="empty-row">${escapeHTML(error.message)}</td></tr>`;
  }
}

surveySearchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  await loadSurveys(surveySearchInput.value.trim());
});

document.getElementById('clearSurveySearch').addEventListener('click', async () => {
  surveySearchInput.value = '';
  await loadSurveys('');
});

loadSurveys();
