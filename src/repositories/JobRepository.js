const pool = require('../config/database');
const { NotFoundError } = require('../exceptions');

class JobRepository {
  async create({ id, company_id, category_id, title, description, requirements,
    type, location, salary_min, salary_max, is_active }) {
    const query = {
      text: `INSERT INTO jobs (id, company_id, category_id, title, description,
             requirements, type, location, salary_min, salary_max, is_active)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      values: [id, company_id, category_id, title, description,
        requirements || null, type || null, location || null,
        salary_min || null, salary_max || null,
        is_active !== undefined ? is_active : true],
    };
    const result = await pool.query(query);
    return result.rows[0];
  }

  async findAll({ title, companyName } = {}) {
    // Exactly 13 keys: id, company_id, category_id, title, description,
    // requirements, type, location, salary_min, salary_max, is_active,
    // created_at, updated_at
    let text = `SELECT j.id, j.company_id, j.category_id, j.title, j.description,
                j.requirements, j.type, j.location, j.salary_min, j.salary_max,
                j.is_active, j.created_at, j.updated_at
                FROM jobs j
                JOIN companies c ON j.company_id = c.id
                WHERE 1=1`;
    const values = [];
    let idx = 1;
    if (title) {
      text += ` AND j.title ILIKE $${idx}`;
      values.push(`%${title}%`);
      idx++;
    }
    if (companyName) {
      text += ` AND c.name ILIKE $${idx}`;
      values.push(`%${companyName}%`);
      idx++;
    }
    text += ' ORDER BY j.created_at DESC';
    const result = await pool.query({ text, values });
    return result.rows;
  }

  async findById(id) {
    const query = {
      text: `SELECT j.*, c.name AS company_name, c.description AS company_description,
             c.location AS company_location, c.website AS company_website,
             cat.name AS category_name, cat.description AS category_description
             FROM jobs j
             JOIN companies c ON j.company_id = c.id
             JOIN categories cat ON j.category_id = cat.id
             WHERE j.id = $1`,
      values: [id],
    };
    const result = await pool.query(query);
    if (!result.rows[0]) throw new NotFoundError('Job not found');
    return result.rows[0];
  }

  async findByCompanyId(companyId) {
    const query = {
      text: `SELECT j.id, j.company_id, j.category_id, j.title, j.description,
             j.requirements, j.type, j.location, j.salary_min, j.salary_max,
             j.is_active, j.created_at, j.updated_at
             FROM jobs j WHERE j.company_id = $1 ORDER BY j.created_at DESC`,
      values: [companyId],
    };
    const result = await pool.query(query);
    return result.rows;
  }

  async findByCategoryId(categoryId) {
    const query = {
      text: `SELECT j.id, j.company_id, j.category_id, j.title, j.description,
             j.requirements, j.type, j.location, j.salary_min, j.salary_max,
             j.is_active, j.created_at, j.updated_at
             FROM jobs j WHERE j.category_id = $1 ORDER BY j.created_at DESC`,
      values: [categoryId],
    };
    const result = await pool.query(query);
    return result.rows;
  }

  async update(id, { company_id, category_id, title, description, requirements,
    type, location, salary_min, salary_max, is_active }) {
    const query = {
      text: `UPDATE jobs SET
             company_id = COALESCE($1, company_id),
             category_id = COALESCE($2, category_id),
             title = COALESCE($3, title),
             description = COALESCE($4, description),
             requirements = COALESCE($5, requirements),
             type = COALESCE($6, type),
             location = COALESCE($7, location),
             salary_min = COALESCE($8, salary_min),
             salary_max = COALESCE($9, salary_max),
             is_active = COALESCE($10, is_active),
             updated_at = current_timestamp
             WHERE id = $11 RETURNING *`,
      values: [company_id, category_id, title, description, requirements,
        type, location, salary_min, salary_max, is_active, id],
    };
    const result = await pool.query(query);
    if (!result.rows[0]) throw new NotFoundError('Job not found');
    return result.rows[0];
  }

  async delete(id) {
    const query = {
      text: 'DELETE FROM jobs WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await pool.query(query);
    if (!result.rows[0]) throw new NotFoundError('Job not found');
    return result.rows[0];
  }
}

module.exports = new JobRepository();
