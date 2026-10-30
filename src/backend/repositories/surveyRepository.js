const pool = require('../db');

class SurveyRepository {
  async findAll() {
    const result = await pool.query(
      `SELECT survey.survey_id AS id, ticket.ticket_code, ticket.customer_name, survey.csat_score,
              survey.nps_score, survey.feedback_content, survey.created_at
       FROM survey_ticket AS survey
       JOIN ticket ON ticket.ticket_id = survey.ticket_id
       ORDER BY survey.created_at DESC, survey.survey_id DESC`
    );
    return result.rows;
  }

  async getStats() {
    const result = await pool.query(
      `SELECT COUNT(*)::INTEGER AS total,
              COALESCE(AVG(csat_score), 0)::NUMERIC(4,1) AS "avgCsat",
              COALESCE(AVG(nps_score), 0)::NUMERIC(4,1) AS "avgNps",
              COALESCE(100.0 * COUNT(*) FILTER (WHERE csat_score >= 4) / NULLIF(COUNT(*), 0), 0)::NUMERIC(5,0) AS "happyRate",
              COALESCE(100.0 * COUNT(*) FILTER (WHERE nps_score >= 9) / NULLIF(COUNT(*), 0), 0)::NUMERIC(5,0) AS "promoterRate"
       FROM survey_ticket`
    );
    const stats = result.rows[0];
    return {
      total: Number(stats.total),
      avgCsat: Number(stats.avgCsat),
      avgNps: Number(stats.avgNps),
      happyRate: Number(stats.happyRate),
      promoterRate: Number(stats.promoterRate)
    };
  }

  async create(data) {
    const result = await pool.query(
      `INSERT INTO survey_ticket (ticket_id, csat_score, nps_score, feedback_content)
       SELECT ticket_id, $2, $3, $4
       FROM ticket
       WHERE ticket_code = $1 AND UPPER(status) IN ('HOAN_TAT', 'CLOSED', 'RESOLVED', 'COMPLETED')
       RETURNING survey_id AS id, ticket_id, csat_score, nps_score, feedback_content, created_at`,
      [data.ticket_code, data.csat_score, data.nps_score, data.feedback_content]
    );
    return result.rows[0] || null;
  }
}

module.exports = new SurveyRepository();
