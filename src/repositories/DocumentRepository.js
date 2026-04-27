const pool = require('../config/database');
const { NotFoundError } = require('../exceptions');

class DocumentRepository {
  async create({ id, user_id, name, original_name, file_path, file_size }) {
    const query = {
      text: `INSERT INTO documents (id, user_id, name, file_path, file_type, file_size)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      values: [id, user_id, original_name, file_path, 'application/pdf', file_size || null],
    };
    const result = await pool.query(query);
    return result.rows[0];
  }

  async findAll() {
    const query = {
      text: `SELECT d.*, u.name as owner_name, u.email as owner_email
             FROM documents d
             JOIN users u ON d.user_id = u.id
             ORDER BY d.created_at DESC`,
    };
    const result = await pool.query(query);
    return result.rows;
  }

  async findById(id) {
    const query = {
      text: `SELECT d.*, u.name as owner_name
             FROM documents d
             JOIN users u ON d.user_id = u.id
             WHERE d.id = $1`,
      values: [id],
    };
    const result = await pool.query(query);
    if (!result.rows[0]) throw new NotFoundError('Document not found');
    return result.rows[0];
  }

  async findByUserId(userId) {
    const query = {
      text: 'SELECT * FROM documents WHERE user_id = $1 ORDER BY created_at DESC',
      values: [userId],
    };
    const result = await pool.query(query);
    return result.rows;
  }

  async delete(id) {
    const query = {
      text: 'DELETE FROM documents WHERE id = $1 RETURNING *',
      values: [id],
    };
    const result = await pool.query(query);
    if (!result.rows[0]) throw new NotFoundError('Document not found');
    return result.rows[0];
  }
}

module.exports = new DocumentRepository();
