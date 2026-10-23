// Giả lập Repository lưu trữ phiếu khảo sát L8
const surveysDB = [
  { id: 1, ticket_code: 'PB-2-00001', csat_score: 5, nps_score: 9, feedback_content: 'Dịch vụ rất tốt' },
  { id: 2, ticket_code: 'PB-2-00002', csat_score: 4, nps_score: 8, feedback_content: 'Sửa chữa nhanh chóng' }
];

class SurveyRepository {
  async findAll() {
    return surveysDB;
  }

  async getStats() {
    const total = surveysDB.length;
    const avgCsat = total
      ? surveysDB.reduce((sum, item) => sum + Number(item.csat_score || 0), 0) / total
      : 0;
    const avgNps = total
      ? surveysDB.reduce((sum, item) => sum + Number(item.nps_score || 0), 0) / total
      : 0;
    const happyRate = total
      ? (surveysDB.filter((item) => Number(item.csat_score) >= 4).length / total) * 100
      : 0;
    const promoterRate = total
      ? (surveysDB.filter((item) => Number(item.nps_score) >= 9).length / total) * 100
      : 0;

    return {
      total,
      avgCsat: Number(avgCsat.toFixed(1)),
      avgNps: Number(avgNps.toFixed(1)),
      happyRate: Number(happyRate.toFixed(0)),
      promoterRate: Number(promoterRate.toFixed(0))
    };
  }

  async create(data) {
    const newSurvey = { id: surveysDB.length + 1, ...data, created_at: new Date() };
    surveysDB.push(newSurvey);
    return newSurvey;
  }
}

module.exports = new SurveyRepository();