const repository = require('../repositories/ticketRepository');
const serviceCenterRepository = require('../repositories/serviceCenterRepository');
const ServiceError = require('./serviceError');

const TICKET_STATUSES = ['MOI', 'DANG_SUA', 'HOAN_TAT'];

function validateId(id) {
  const parsed = Number(id);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new ServiceError('Mã phiếu không hợp lệ');
  }
  return parsed;
}

function validateData(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new ServiceError('Dữ liệu phiếu bảo hành không hợp lệ');
  }
  const ticketCode = typeof data.ticket_code === 'string' ? data.ticket_code.trim() : '';
  const customerName = typeof data.customer_name === 'string' ? data.customer_name.trim() : '';
  const customerPhone = typeof data.customer_phone === 'string' ? data.customer_phone.trim() : '';
  const deviceModel = typeof data.device_model === 'string' ? data.device_model.trim() : '';
  const centerId = Number(data.center_id);
  const status = typeof data.status === 'string' ? data.status.trim().toUpperCase() : 'MOI';

  if (!ticketCode || ticketCode.length > 20) throw new ServiceError('Mã phiếu cần có từ 1 đến 20 ký tự');
  if (customerName.length < 2 || customerName.length > 100) throw new ServiceError('Tên khách hàng cần có từ 2 đến 100 ký tự');
  if (!/^[0-9+() -]{7,20}$/.test(customerPhone)) throw new ServiceError('Số điện thoại cần có từ 7 đến 20 ký tự hợp lệ');
  if (!deviceModel || deviceModel.length > 100) throw new ServiceError('Tên thiết bị cần có từ 1 đến 100 ký tự');
  if (!Number.isInteger(centerId) || centerId < 1) throw new ServiceError('Vui lòng chọn trung tâm bảo hành hợp lệ');
  if (!TICKET_STATUSES.includes(status)) throw new ServiceError('Trạng thái phải là MOI, DANG_SUA hoặc HOAN_TAT');

  return {
    ticket_code: ticketCode,
    center_id: centerId,
    customer_name: customerName,
    customer_phone: customerPhone,
    device_model: deviceModel,
    status
  };
}

class TicketService {
  async findAll(filters) {
    const query = {};
    if (filters.status) {
      const status = String(filters.status).trim().toUpperCase();
      if (!TICKET_STATUSES.includes(status)) throw new ServiceError('Trạng thái phiếu không hợp lệ');
      query.status = status;
    }
    if (filters.center_id) {
      query.center_id = validateId(filters.center_id);
    }
    if (filters.search) {
      query.search = String(filters.search).trim().slice(0, 100);
    }
    return await repository.findAll(query);
  }

  async findById(id) {
    const ticket = await repository.findById(validateId(id));
    if (!ticket) throw new ServiceError('Không tìm thấy phiếu bảo hành', 404, 'NOT_FOUND');
    return ticket;
  }

  async create(data) {
    const ticket = validateData(data);
    if (!await serviceCenterRepository.findById(ticket.center_id)) {
      throw new ServiceError('Không tìm thấy trung tâm bảo hành', 400, 'INVALID_CENTER');
    }
    try {
      return await repository.create(ticket);
    } catch (error) {
      if (error.code === '23505') throw new ServiceError('Mã phiếu đã tồn tại', 409, 'DUPLICATE_TICKET');
      throw error;
    }
  }

  async update(id, data) {
    const ticketId = validateId(id);
    const ticketData = validateData(data);
    if (!await serviceCenterRepository.findById(ticketData.center_id)) {
      throw new ServiceError('Không tìm thấy trung tâm bảo hành', 400, 'INVALID_CENTER');
    }
    try {
      const ticket = await repository.update(ticketId, ticketData);
      if (!ticket) throw new ServiceError('Không tìm thấy phiếu bảo hành', 404, 'NOT_FOUND');
      return ticket;
    } catch (error) {
      if (error.code === '23505') throw new ServiceError('Mã phiếu đã tồn tại', 409, 'DUPLICATE_TICKET');
      throw error;
    }
  }

  async delete(id) {
    try {
      const deleted = await repository.delete(validateId(id));
      if (!deleted) throw new ServiceError('Không tìm thấy phiếu bảo hành', 404, 'NOT_FOUND');
    } catch (error) {
      if (error.code === '23503' || error.code === '23001') {
        throw new ServiceError('Không thể xóa phiếu đã có phản hồi khảo sát', 409, 'TICKET_HAS_SURVEY');
      }
      throw error;
    }
  }
}

module.exports = new TicketService();
