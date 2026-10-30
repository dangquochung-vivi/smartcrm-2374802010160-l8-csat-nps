const tokenKey = 'smartcrm_token';
const state = { centers: [], tickets: [] };
const centerForm = document.getElementById('centerForm');
const ticketForm = document.getElementById('ticketForm');
const centerRows = document.getElementById('centerRows');
const ticketRows = document.getElementById('ticketRows');
const centerMessage = document.getElementById('centerMessage');
const ticketMessage = document.getElementById('ticketMessage');

async function api(url, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${localStorage.getItem(tokenKey) || ''}`);
  if (options.body) headers.set('Content-Type', 'application/json');
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    localStorage.removeItem(tokenKey);
    window.location.replace('/login');
    throw new Error('Phiên đăng nhập đã hết hạn');
  }
  const result = await response.json();
  if (!response.ok || !result.success) throw new Error(result.error || 'Yêu cầu thất bại');
  return result.data;
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function setTableState(element, message, columns) {
  element.innerHTML = `<tr><td colspan="${columns}">${escapeHTML(message)}</td></tr>`;
}

function renderCenters() {
  if (!state.centers.length) {
    setTableState(centerRows, 'Chưa có trung tâm. Hãy thêm trung tâm trước khi tạo phiếu.', 3);
    return;
  }
  centerRows.innerHTML = state.centers.map((center) => `
    <tr>
      <td>${escapeHTML(center.center_name)}</td>
      <td>${escapeHTML(center.address)}</td>
      <td>
        <button type="button" data-edit-center="${center.center_id}">Sửa</button>
        <button type="button" data-delete-center="${center.center_id}">Xóa</button>
      </td>
    </tr>
  `).join('');
}

function renderTickets() {
  if (!state.tickets.length) {
    setTableState(ticketRows, 'Chưa có phiếu bảo hành.', 5);
    return;
  }
  ticketRows.innerHTML = state.tickets.map((ticket) => `
    <tr>
      <td>${escapeHTML(ticket.ticket_code)}</td>
      <td>${escapeHTML(ticket.customer_name)}</td>
      <td>${escapeHTML(ticket.center_name)}</td>
      <td>${escapeHTML(ticket.status)}</td>
      <td>
        <button type="button" data-edit-ticket="${ticket.ticket_id}">Sửa</button>
        <button type="button" data-delete-ticket="${ticket.ticket_id}">Xóa</button>
      </td>
    </tr>
  `).join('');
}

function renderCenterOptions(selectedId) {
  const options = state.centers.map((center) =>
    `<option value="${center.center_id}">${escapeHTML(center.center_name)}</option>`
  ).join('');
  document.getElementById('ticketCenter').innerHTML = options || '<option value="">Thêm trung tâm trước</option>';
  if (selectedId) document.getElementById('ticketCenter').value = String(selectedId);
}

async function loadCenters() {
  setTableState(centerRows, 'Đang tải trung tâm...', 3);
  try {
    state.centers = await api('/api/service-centers');
    renderCenters();
    renderCenterOptions();
  } catch (error) {
    setTableState(centerRows, `Không thể tải trung tâm: ${error.message}`, 3);
    centerMessage.textContent = error.message;
  }
}

async function loadTickets() {
  setTableState(ticketRows, 'Đang tải phiếu...', 5);
  try {
    state.tickets = await api('/api/tickets');
    renderTickets();
  } catch (error) {
    setTableState(ticketRows, `Không thể tải phiếu: ${error.message}`, 5);
    ticketMessage.textContent = error.message;
  }
}

function resetCenterForm() {
  centerForm.reset();
  document.getElementById('centerId').value = '';
  document.getElementById('saveCenterButton').textContent = 'Thêm trung tâm';
  document.getElementById('cancelCenterEdit').hidden = true;
}

function resetTicketForm() {
  ticketForm.reset();
  document.getElementById('ticketId').value = '';
  document.getElementById('saveTicketButton').textContent = 'Thêm phiếu';
  document.getElementById('cancelTicketEdit').hidden = true;
  renderCenterOptions();
}

centerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  centerMessage.textContent = 'Đang lưu trung tâm...';
  const id = document.getElementById('centerId').value;
  const payload = {
    center_name: document.getElementById('centerName').value,
    address: document.getElementById('centerAddress').value
  };
  try {
    await api(id ? `/api/service-centers/${id}` : '/api/service-centers', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(payload)
    });
    resetCenterForm();
    centerMessage.textContent = 'Đã lưu trung tâm.';
    await loadCenters();
  } catch (error) {
    centerMessage.textContent = error.message;
  }
});

ticketForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  ticketMessage.textContent = 'Đang lưu phiếu...';
  const id = document.getElementById('ticketId').value;
  const payload = {
    ticket_code: document.getElementById('ticketCode').value,
    center_id: Number(document.getElementById('ticketCenter').value),
    customer_name: document.getElementById('ticketCustomer').value,
    customer_phone: document.getElementById('ticketPhone').value,
    device_model: document.getElementById('ticketDevice').value,
    status: document.getElementById('ticketStatus').value
  };
  try {
    await api(id ? `/api/tickets/${id}` : '/api/tickets', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(payload)
    });
    resetTicketForm();
    ticketMessage.textContent = 'Đã lưu phiếu.';
    await loadTickets();
  } catch (error) {
    ticketMessage.textContent = error.message;
  }
});

centerRows.addEventListener('click', async (event) => {
  const editId = event.target.dataset.editCenter;
  const deleteId = event.target.dataset.deleteCenter;
  if (editId) {
    const center = state.centers.find((item) => item.center_id === Number(editId));
    if (!center) return;
    document.getElementById('centerId').value = center.center_id;
    document.getElementById('centerName').value = center.center_name;
    document.getElementById('centerAddress').value = center.address;
    document.getElementById('saveCenterButton').textContent = 'Cập nhật trung tâm';
    document.getElementById('cancelCenterEdit').hidden = false;
  }
  if (deleteId && window.confirm('Xóa trung tâm này? Trung tâm đang có phiếu sẽ không thể xóa.')) {
    centerMessage.textContent = 'Đang xóa trung tâm...';
    try {
      await api(`/api/service-centers/${deleteId}`, { method: 'DELETE' });
      centerMessage.textContent = 'Đã xóa trung tâm.';
      await loadCenters();
    } catch (error) {
      centerMessage.textContent = error.message;
    }
  }
});

ticketRows.addEventListener('click', async (event) => {
  const editId = event.target.dataset.editTicket;
  const deleteId = event.target.dataset.deleteTicket;
  if (editId) {
    const ticket = state.tickets.find((item) => item.ticket_id === Number(editId));
    if (!ticket) return;
    document.getElementById('ticketId').value = ticket.ticket_id;
    document.getElementById('ticketCode').value = ticket.ticket_code;
    document.getElementById('ticketCustomer').value = ticket.customer_name;
    document.getElementById('ticketPhone').value = ticket.customer_phone;
    document.getElementById('ticketDevice').value = ticket.device_model;
    document.getElementById('ticketStatus').value = ticket.status;
    renderCenterOptions(ticket.center_id);
    document.getElementById('saveTicketButton').textContent = 'Cập nhật phiếu';
    document.getElementById('cancelTicketEdit').hidden = false;
  }
  if (deleteId && window.confirm('Xóa phiếu bảo hành này? Phiếu đã có khảo sát sẽ không thể xóa.')) {
    ticketMessage.textContent = 'Đang xóa phiếu...';
    try {
      await api(`/api/tickets/${deleteId}`, { method: 'DELETE' });
      ticketMessage.textContent = 'Đã xóa phiếu.';
      await loadTickets();
    } catch (error) {
      ticketMessage.textContent = error.message;
    }
  }
});

document.getElementById('cancelCenterEdit').addEventListener('click', resetCenterForm);
document.getElementById('cancelTicketEdit').addEventListener('click', resetTicketForm);

async function initialize() {
  if (!localStorage.getItem(tokenKey)) {
    window.location.replace('/login');
    return;
  }
  try {
    const user = await api('/auth/me');
    if (user.role === 'customer') {
      window.location.replace('/customer');
      return;
    }
    await Promise.all([loadCenters(), loadTickets()]);
  } catch (error) {
    centerMessage.textContent = error.message;
    ticketMessage.textContent = error.message;
  }
}

initialize();
