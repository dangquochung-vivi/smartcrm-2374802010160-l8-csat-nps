const surveyRepository = require('../repositories/surveyRepository');

class SurveyService {
  async getAllSurveys() {
    return await surveyRepository.findAll();
  }

  async submitSurvey(data) {
    const { csat_score, nps_score } = data;
    if (csat_score < 1 || csat_score > 5) {
      throw new Error('Điểm CSAT phải từ 1 đến 5');
    }
    if (nps_score < 0 || nps_score > 10) {
      throw new Error('Điểm NPS phải từ 0 đến 10');
    }
    return await surveyRepository.create(data);
  }
}

module.exports = new SurveyService();