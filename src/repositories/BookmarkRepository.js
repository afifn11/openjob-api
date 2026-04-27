const pool = require('../config/database');
const { NotFoundError } = require('../exceptions');

class BookmarkRepository {
  async create({ id, user_id, job_id }) {
    const query = {
      text: 'INSERT INTO bookmarks (id, user_id, job_id) VALUES ($1,$2,$3) RETURNING *',
      values: [id, user_id, job_id],
    };
    const result = await pool.query(query);
    return result.rows[0];
  }

  async findAll() {
    const query = {
      text: `SELECT b.id, b.user_id, b.job_id, b.created_at,
             j.title, j.description, j.requirements, j.type, j.location,
             j.salary_min, j.salary_max, j.is_active, j.company_id,
             j.category_id, j.created_at AS job_created_at, j.updated_at AS job_updated_at,
             c.name AS company_name, cat.name AS category_name
             FROM bookmarks b
             JOIN jobs j ON b.job_id = j.id
             JOIN companies c ON j.company_id = c.id
             JOIN categories cat ON j.category_id = cat.id
             ORDER BY b.created_at DESC`,
    };
    const result = await pool.query(query);
    return result.rows;
  }

  async findById(id) {
    const query = {
      text: `SELECT b.id, b.user_id, b.job_id, b.created_at,
             j.title, j.description, j.requirements, j.type, j.location,
             j.salary_min, j.salary_max, j.is_active, j.company_id,
             j.category_id, j.created_at AS job_created_at, j.updated_at AS job_updated_at,
             c.name AS company_name, cat.name AS category_name
             FROM bookmarks b
             JOIN jobs j ON b.job_id = j.id
             JOIN companies c ON j.company_id = c.id
             JOIN categories cat ON j.category_id = cat.id
             WHERE b.id = $1`,
      values: [id],
    };
    const result = await pool.query(query);
    if (!result.rows[0]) throw new NotFoundError('Bookmark not found');
    return result.rows[0];
  }

  async findByJobAndUser(jobId, userId) {
    const query = {
      text: 'SELECT * FROM bookmarks WHERE job_id = $1 AND user_id = $2',
      values: [jobId, userId],
    };
    const result = await pool.query(query);
    return result.rows[0] || null;
  }

  async findByUserId(userId) {
    // Exactly 18 keys
    const query = {
      text: `SELECT b.id, b.user_id, b.job_id, b.created_at,
             j.title, j.description, j.requirements, j.type, j.location,
             j.salary_min, j.salary_max, j.is_active, j.company_id,
             j.category_id, j.created_at AS job_created_at, j.updated_at AS job_updated_at,
             c.name AS company_name, cat.name AS category_name
             FROM bookmarks b
             JOIN jobs j ON b.job_id = j.id
             JOIN companies c ON j.company_id = c.id
             JOIN categories cat ON j.category_id = cat.id
             WHERE b.user_id = $1
             ORDER BY b.created_at DESC`,
      values: [userId],
    };
    const result = await pool.query(query);
    return result.rows;
  }

  async deleteByJobAndUser(jobId, userId) {
    const query = {
      text: 'DELETE FROM bookmarks WHERE job_id = $1 AND user_id = $2 RETURNING id',
      values: [jobId, userId],
    };
    const result = await pool.query(query);
    if (!result.rows[0]) throw new NotFoundError('Bookmark not found');
    return result.rows[0];
  }
}

module.exports = new BookmarkRepository();
