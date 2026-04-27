require('dotenv').config();
const app = require('./app');
const { getRedisClient } = require('./config/redis');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // Try connecting Redis (non-fatal if not available)
  try {
    await getRedisClient();
  } catch (err) {
    console.warn('⚠️  Redis not available:', err.message);
    console.warn('⚠️  Caching disabled - API will still work');
  }

  app.listen(PORT, HOST, () => {
    console.log(`🚀 OpenJob API v2 running at http://${HOST}:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📌 Consumer: run "npm run start:consumer" in a separate terminal`);
  });
};

startServer();
