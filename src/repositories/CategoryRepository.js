const pool = require('../config/database');
const { NotFoundError } = require('../exceptions');

class CategoryRepository {
  async create({ id, name, description }) {
    const query = {
      text: `INSERT INTO categories (id, name, description)
             VALUES ($1, $2, $3) RETURNING *`,
      values: [id, name, description || null],
    };
    const result = await pool.query(query);
    return result.rows[0];
  }

  async findAll() {
    // Exactly 4 keys: id, name, description, created_at
    const query = {
      text: 'SELECT id, name, description, created_at FROM categories ORDER BY name ASC',
    };
    const result = await pool.query(query);
    return result.rows;
  }

  async findById(id) {
    const query = {
      text: 'SELECT * FROM categories WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    if (!result.rows[0]) throw new NotFoundError('Category not found');
    return result.rows[0];
  }

  async update(id, { name, description }) {
    const query = {
      text: `UPDATE categories SET
             name = COALESCE($1, name),
             description = COALESCE($2, description),
             updated_at = current_timestamp
             WHERE id = $3 RETURNING *`,
      values: [name, description, id],
    };
    const result = await pool.query(query);
    if (!result.rows[0]) throw new NotFoundError('Category not found');
    return result.rows[0];
  }

  async delete(id) {
    const query = {
      text: 'DELETE FROM categories WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await pool.query(query);
    if (!result.rows[0]) throw new NotFoundError('Category not found');
    return result.rows[0];
  }
}

module.exports = new CategoryRepository();
