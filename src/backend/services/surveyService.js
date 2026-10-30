const surveyRepository = require('../repositories/surveyRepository');
const ServiceError = require('./serviceError');

class SurveyService {
  async getAllSurveys() {
    return await surveyRepository.findAll();
  }

  async getStats() {
    return await surveyRepository.getStats();
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