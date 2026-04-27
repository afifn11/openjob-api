const pool = require('../config/database');
const { NotFoundError, ConflictError } = require('../exceptions');

class UserRepository {
  async create({ id, name, email, password, role, phone, address, bio }) {
    const query = {
      text: `INSERT INTO users (id, name, email, password, role, phone, address, bio)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING id, name, email, role, phone, address, bio, created_at`,
      values: [id, name, email, password, role || 'user', phone || null, address || null, bio || null],
    };

    const result = await pool.query(query);
    return result.rows[0];
  }

  async findById(id) {
    const query = {
      text: `SELECT id, name, email, role, phone, address, bio, avatar, created_at, updated_at
             FROM users WHERE id = $1`,
      values: [id],
    };
    const result = await pool.query(query);
    if (!result.rows[0]) throw new NotFoundError('User not found');
    return result.rows[0];
  }

  async findByEmail(email) {
    const query = {
      text: `SELECT id, name, email, password, role, phone, address, bio, avatar
             FROM users WHERE email = $1`,
      values: [email],
    };
    const result = await pool.query(query);
    return result.rows[0] || null;
  }

  async checkEmailExists(email) {
    const query = {
      text: 'SELECT id FROM users WHERE email = $1',
      values: [email],
    };
    const result = await pool.query(query);
    if (result.rows[0]) throw new ConflictError('Email already registered');
  }

  async update(id, { name, phone, address, bio }) {
    const query = {
      text: `UPDATE users SET name = COALESCE($1, name), phone = COALESCE($2, phone),
             address = COALESCE($3, address), bio = COALESCE($4, bio),
             updated_at = current_timestamp
             WHERE id = $5
             RETURNING id, name, email, role, phone, address, bio, updated_at`,
      values: [name, phone, address, bio, id],
    };
    const result = await pool.query(query);
    if (!result.rows[0]) throw new NotFoundError('User not found');
    return result.rows[0];
  }
}

module.exports = new UserRepository();
