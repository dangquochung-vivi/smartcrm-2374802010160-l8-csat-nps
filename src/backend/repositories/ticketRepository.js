const pool = require('../db');

const ticketFields = `
  ticket.ticket_id,
  ticket.ticket_code,
  ticket.center_id,
  service_center.center_name,
  ticket.customer_name,
  ticket.customer_phone,
  ticket.device_model,
  ticket.status,
  ticket.created_at`;

class TicketRepository {
  async findAll(filters = {}) {
    const conditions = [];
    const values = [];
    if (filters.status) {
      values.push(filters.status);
      conditions.push(`ticket.status = $${values.length}`);
    }
    if (filters.center_id) {
      values.push(filters.center_id);
      conditions.push(`ticket.center_id = $${values.length}`);
    }
    if (filters.search) {
      values.push(`%${filters.search}%`);
      conditions.push(`(ticket.ticket_code ILIKE $${values.length} OR ticket.customer_name ILIKE $${values.length})`);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await pool.query(
      `SELECT ${ticketFields}
       FROM ticket JOIN service_center USING (center_id)
       ${where}
       ORDER BY ticket.ticket_id`,
      values
    );
    return result.rows;
  }

  async findById(id) {
    const result = await pool.query(
      `SELECT ${ticketFields}
       FROM ticket JOIN service_center USING (center_id)
       WHERE ticket.ticket_id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data) {
    const result = await pool.query(
      `INSERT INTO ticket (ticket_code, center_id, customer_name, customer_phone, device_model, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING ticket_id, ticket_code, center_id, customer_name, customer_phone, device_model, status, created_at`,
      [data.ticket_code, data.center_id, data.customer_name, data.customer_phone, data.device_model, data.status]
    );
    return this.findById(result.rows[0].ticket_id);
  }

  async update(id, data) {
    const result = await pool.query(
      `UPDATE ticket
       SET ticket_code = $2, center_id = $3, customer_name = $4, customer_phone = $5, device_model = $6, status = $7
       WHERE ticket_id = $1
       RETURNING ticket_id`,
      [id, data.ticket_code, data.center_id, data.customer_name, data.customer_phone, data.device_model, data.status]
    );
    return result.rowCount ? this.findById(id) : null;
  }

  async delete(id) {
    const result = await pool.query('DELETE FROM ticket WHERE ticket_id = $1 RETURNING ticket_id', [id]);
    return Boolean(result.rowCount);
  }
}

module.exports = new TicketRepository();
