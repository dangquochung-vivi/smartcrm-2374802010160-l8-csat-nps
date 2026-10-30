const surveyRepository = require('../repositories/surveyRepository');
const ServiceError = require('./serviceError');
const normalizePhone = require('../utils/phone');

class SurveyService {
  async getAllSurveys(search) {
    let normalizedSearch = '';
    if (search !== undefined && search !== null) {
      if (typeof search !== 'string') {
        throw new ServiceError('Từ khóa tìm kiếm không hợp lệ', 400, 'INVALID_SEARCH');
      }
      normalizedSearch = search.trim().slice(0, 100);
    }
    return await surveyRepository.findAll(normalizedSearch);
  }

  async getStats() {
    return await surveyRepository.getStats();
  }

  async findCustomerTicket(ticketCode, customerPhone) {
    const code = typeof ticketCode === 'string' ? ticketCode.trim() : '';
    const phone = typeof customerPhone === 'string' ? customerPhone.trim() : '';
    if (!code || code.length > 20) {
      throw new ServiceError('Vui lòng nhập mã phiếu từ 1 đến 20 ký tự', 400, 'INVALID_TICKET_LOOKUP');
    }
    const normalizedPhone = normalizePhone(phone);
    if (!/^[0-9+(). -]{7,24}$/.test(phone) || normalizedPhone.length < 7 || normalizedPhone.length > 15) {
      throw new ServiceError('Số điện thoại cần có từ 7 đến 15 chữ số hợp lệ', 400, 'INVALID_TICKET_LOOKUP');
    }

    const ticket = await surveyRepository.findCustomerTicket(code, normalizedPhone);
    if (!ticket) {
      throw new ServiceError('Không tìm thấy phiếu đã hoàn tất khớp với mã phiếu và số điện thoại', 404, 'TICKET_NOT_FOUND');
    }
    return {
      ticket_code: ticket.ticket_code,
      customer_name: ticket.customer_name,
      device_model: ticket.device_model,
      already_surveyed: ticket.already_surveyed
    };
  }

  async submitSurvey(data) {
    const invalid = (message) => { throw new ServiceError(message, 400, 'INVALID_SURVEY'); };

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      invalid('Dữ liệu khảo sát không hợp lệ');
    }

    const ticketCode = typeof data.ticket_code === 'string' ? data.ticket_code.trim() : '';
    if (!ticketCode || ticketCode.length > 20) {
      invalid('Mã phiếu cần có từ 1 đến 20 ký tự');
    }
    const customerPhone = typeof data.customer_phone === 'string' ? data.customer_phone.trim() : '';
    const normalizedPhone = normalizePhone(customerPhone);
    if (!/^[0-9+(). -]{7,24}$/.test(customerPhone) || normalizedPhone.length < 7 || normalizedPhone.length > 15) {
      invalid('Số điện thoại cần có từ 7 đến 15 chữ số hợp lệ');
    }
    if (!Number.isInteger(data.csat_score) || data.csat_score < 1 || data.csat_score > 5) {
      invalid('Điểm CSAT phải là số nguyên từ 1 đến 5');
    }
    if (!Number.isInteger(data.nps_score) || data.nps_score < 0 || data.nps_score > 10) {
      invalid('Điểm NPS phải là số nguyên từ 0 đến 10');
    }
    if (data.feedback_content !== undefined
      && (typeof data.feedback_content !== 'string' || data.feedback_content.length > 500)) {
      invalid('Nhận xét phải là văn bản không quá 500 ký tự');
    }

    const survey = await surveyRepository.create({
      ...data,
      ticket_code: ticketCode,
      customer_phone: normalizedPhone,
      feedback_content: data.feedback_content?.trim() || ''
    });
    if (!survey) {
      throw new ServiceError(
        'Không tìm thấy phiếu đã hoàn tất hoặc phiếu này chưa đủ điều kiện khảo sát',
        404,
        'TICKET_NOT_ELIGIBLE'
      );
    }
    return { ...survey, ticket_code: ticketCode };
  }
}

module.exports = new SurveyService();