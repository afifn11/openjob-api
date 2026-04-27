const pool = require('../config/database');
const { NotFoundError } = require('../exceptions');

class CompanyRepository {
  async create({ id, userId, name, description, industry, website, logo, location, size, founded_year }) {
    const query = {
      text: `INSERT INTO companies (id, user_id, name, description, industry, website, logo, location, size, founded_year)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING *`,
      values: [id, userId, name, description || null, industry || null,
        website || null, logo || null, location || null, size || null, founded_year || null],
    };
    const result = await pool.query(query);
    return result.rows[0];
  }

  async findAll() {
    // Exactly 6 keys: id, user_id, name, description, location, created_at
    const query = {
      text: `SELECT id, user_id, name, description, location, created_at
             FROM companies
             ORDER BY created_at DESC`,
    };
    const result = await pool.query(query);
    return result.rows;
  }

  async findById(id) {
    const query = {
      text: `SELECT c.*, u.name AS owner_name, u.email AS owner_email
             FROM companies c
             JOIN users u ON c.user_id = u.id
             WHERE c.id = $1`,
      values: [id],
    };
    const result = await pool.query(query);
    if (!result.rows[0]) throw new NotFoundError('Company not found');
    return result.rows[0];
  }

  async findByUserId(userId) {
    const query = {
      text: 'SELECT * FROM companies WHERE user_id = $1',
      values: [userId],
    };
    const result = await pool.query(query);
    return result.rows;
  }

  async update(id, { name, description, industry, website, logo, location, size, founded_year }) {
    const query = {
      text: `UPDATE companies SET
             name = COALESCE($1, name),
             description = COALESCE($2, description),
             industry = COALESCE($3, industry),
             website = COALESCE($4, website),
             logo = COALESCE($5, logo),
             location = COALESCE($6, location),
             size = COALESCE($7, size),
             founded_year = COALESCE($8, founded_year),
             updated_at = current_timestamp
             WHERE id = $9 RETURNING *`,
      values: [name, description, industry, website, logo, location, size, founded_year, id],
    };
    const result = await pool.query(query);
    if (!result.rows[0]) throw new NotFoundError('Company not found');
    return result.rows[0];
  }

  async delete(id) {
    const query = {
      text: 'DELETE FROM companies WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await pool.query(query);
    if (!result.rows[0]) throw new NotFoundError('Company not found');
    return result.rows[0];
  }
}

module.exports = new CompanyRepository();
