const pool = require('../db');

class ServiceCenterRepository {
  async findAll() {
    const result = await pool.query(
      'SELECT center_id, center_name, address, created_at FROM service_center ORDER BY center_id'
    );
    return result.rows;
  }

  async findById(id) {
    const result = await pool.query(
      'SELECT center_id, center_name, address, created_at FROM service_center WHERE center_id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data) {
    const result = await pool.query(
      'INSERT INTO service_center (center_name, address) VALUES ($1, $2) RETURNING center_id, center_name, address, created_at',
      [data.center_name, data.address]
    );
    return result.rows[0];
  }

  async update(id, data) {
    const result = await pool.query(
      'UPDATE service_center SET center_name = $2, address = $3 WHERE center_id = $1 RETURNING center_id, center_name, address, created_at',
      [id, data.center_name, data.address]
    );
    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await pool.query('DELETE FROM service_center WHERE center_id = $1 RETURNING center_id', [id]);
    return Boolean(result.rowCount);
  }
}

module.exports = new ServiceCenterRepository();
