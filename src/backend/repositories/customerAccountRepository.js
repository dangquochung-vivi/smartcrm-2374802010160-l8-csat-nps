const pool = require('../db');

class CustomerAccountRepository {
  async findByEmail(email) {
    const result = await pool.query(
      `SELECT email, name, password_salt, password_hash
       FROM customer_account
       WHERE email = $1`,
      [email]
    );
    const account = result.rows[0];
    if (!account) return null;
    return {
      username: account.email,
      email: account.email,
      name: account.name,
      role: 'customer',
      salt: account.password_salt,
      passwordHash: account.password_hash
    };
  }

  async create({ email, name, salt, passwordHash }) {
    const result = await pool.query(
      `INSERT INTO customer_account (email, name, password_salt, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING email, name`,
      [email, name, salt, passwordHash]
    );
    return {
      username: result.rows[0].email,
      email: result.rows[0].email,
      name: result.rows[0].name,
      role: 'customer'
    };
  }
}

module.exports = new CustomerAccountRepository();
