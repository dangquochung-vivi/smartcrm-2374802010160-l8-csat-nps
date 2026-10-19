// Giả lập Repository lưu trữ phiếu khảo sát L8
const surveysDB = [
  { id: 1, ticket_code: 'PB-2-00001', csat_score: 5, nps_score: 9, feedback_content: 'Dịch vụ rất tốt' },
  { id: 2, ticket_code: 'PB-2-00002', csat_score: 4, nps_score: 8, feedback_content: 'Sửa chữa nhanh chóng' }
];

class SurveyRepository {
  async findAll() {
    return surveysDB;
  }

  async create(data) {
    const newSurvey = { id: surveysDB.length + 1, ...data, created_at: new Date() };
    surveysDB.push(newSurvey);
    return newSurvey;
  }
}

module.exports = new SurveyRepository();