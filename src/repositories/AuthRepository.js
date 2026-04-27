const pool = require('../config/database');
const { AuthenticationError } = require('../exceptions');

class AuthRepository {
  async saveRefreshToken({ id, userId, refreshToken }) {
    const query = {
      text: `INSERT INTO authentications (id, user_id, refresh_token)
             VALUES ($1, $2, $3) RETURNING id`,
      values: [id, userId, refreshToken],
    };
    const result = await pool.query(query);
    return result.rows[0];
  }

  async findByRefreshToken(refreshToken) {
    const query = {
      text: 'SELECT * FROM authentications WHERE refresh_token = $1',
      values: [refreshToken],
    };
    const result = await pool.query(query);
    if (!result.rows[0]) throw new AuthenticationError('Refresh token not found');
    return result.rows[0];
  }

  async deleteByRefreshToken(refreshToken) {
    const query = {
      text: 'DELETE FROM authentications WHERE refresh_token = $1 RETURNING id',
      values: [refreshToken],
    };
    const result = await pool.query(query);
    if (!result.rows[0]) throw new AuthenticationError('Refresh token not found');
    return result.rows[0];
  }

  async deleteByUserId(userId) {
    const query = {
      text: 'DELETE FROM authentications WHERE user_id = $1',
      values: [userId],
    };
    await pool.query(query);
  }
}

module.exports = new AuthRepository();
