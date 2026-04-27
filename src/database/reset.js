require('dotenv').config();
const pool = require('../config/database');

const resetDatabase = async () => {
  const client = await pool.connect();
  try {
    console.log('🗑️  Resetting database...');
    await client.query(`
      TRUNCATE TABLE 
        documents,
        bookmarks,
        applications,
        authentications,
        jobs,
        companies,
        categories,
        users
      RESTART IDENTITY CASCADE;
    `);
    console.log('✅ Database reset complete! All tables cleared.');
  } catch (err) {
    console.error('❌ Reset failed:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
};

resetDatabase();
