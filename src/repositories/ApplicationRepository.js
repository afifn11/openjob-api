const pool = require('../config/database');
const { NotFoundError, ValidationError } = require('../exceptions');

class ApplicationRepository {
  async create({ id, user_id, job_id, cover_letter }) {
    try {
      const query = {
        text: `INSERT INTO applications (id, user_id, job_id, cover_letter)
               VALUES ($1, $2, $3, $4) RETURNING *`,
        values: [id, user_id, job_id, cover_letter || null],
      };
      const result = await pool.query(query);
      return result.rows[0];
    } catch (err) {
      // Unique violation (duplicate application) → 400
      if (err.code === '23505') {
        throw new ValidationError('You have already applied for this job');
      }
      throw err;
    }
  }

  async findAll() {
    const query = {
      text: `SELECT
               a.id, a.user_id, a.job_id, a.cover_letter, a.status,
               a.applied_at, a.updated_at,
               u.name AS applicant_name, u.email AS applicant_email,
               j.title AS job_title, j.type AS job_type,
               c.name AS company_name, c.id AS company_id
             FROM applications a
             JOIN users u ON a.user_id = u.id
             JOIN jobs j ON a.job_id = j.id
             JOIN companies c ON j.company_id = c.id
             ORDER BY a.applied_at DESC`,
    };
    const result = await pool.query(query);
    return result.rows;
  }

  async findById(id) {
    const query = {
      text: `SELECT
               a.id, a.user_id, a.job_id, a.cover_letter, a.status,
               a.applied_at, a.updated_at,
               u.name AS applicant_name, u.email AS applicant_email,
               j.title AS job_title, j.type AS job_type,
               c.name AS company_name, c.id AS company_id
             FROM applications a
             JOIN users u ON a.user_id = u.id
             JOIN jobs j ON a.job_id = j.id
             JOIN companies c ON j.company_id = c.id
             WHERE a.id = $1`,
      values: [id],
    };
    const result = await pool.query(query);
    if (!result.rows[0]) throw new NotFoundError('Application not found');
    return result.rows[0];
  }

  async findByUserId(userId) {
    const query = {
      text: `SELECT
               a.id, a.user_id, a.job_id, a.cover_letter, a.status,
               a.applied_at, a.updated_at,
               u.name AS applicant_name, u.email AS applicant_email,
               j.title AS job_title, j.type AS job_type,
               c.name AS company_name, c.id AS company_id,
               j.location AS job_location, j.salary_min
             FROM applications a
             JOIN users u ON a.user_id = u.id
             JOIN jobs j ON a.job_id = j.id
             JOIN companies c ON j.company_id = c.id
             WHERE a.user_id = $1
             ORDER BY a.applied_at DESC`,
      values: [userId],
    };
    const result = await pool.query(query);
    return result.rows;
  }

  async findByJobId(jobId) {
    const query = {
      text: `SELECT
               a.id, a.user_id, a.job_id, a.cover_letter, a.status,
               a.applied_at, a.updated_at,
               u.name AS applicant_name, u.email AS applicant_email,
               j.title AS job_title, j.type AS job_type,
               c.name AS company_name, c.id AS company_id
             FROM applications a
             JOIN users u ON a.user_id = u.id
             JOIN jobs j ON a.job_id = j.id
             JOIN companies c ON j.company_id = c.id
             WHERE a.job_id = $1
             ORDER BY a.applied_at DESC`,
      values: [jobId],
    };
    const result = await pool.query(query);
    return result.rows;
  }

  async updateStatus(id, status) {
    const query = {
      text: `UPDATE applications SET status = $1, updated_at = current_timestamp
             WHERE id = $2 RETURNING *`,
      values: [status, id],
    };
    const result = await pool.query(query);
    if (!result.rows[0]) throw new NotFoundError('Application not found');
    return result.rows[0];
  }

  async delete(id) {
    const query = {
      text: 'DELETE FROM applications WHERE id = $1 RETURNING *',
      values: [id],
    };
    const result = await pool.query(query);
    if (!result.rows[0]) throw new NotFoundError('Application not found');
    return result.rows[0];
  }
}

module.exports = new ApplicationRepository();
