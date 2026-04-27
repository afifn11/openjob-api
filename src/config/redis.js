const { createClient } = require('redis');

let client = null;
let isConnected = false;

const getRedisClient = async () => {
  if (client && isConnected) return client;

  client = createClient({
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      reconnectStrategy: (retries) => {
        if (retries > 3) return new Error('Redis max retries reached');
        return Math.min(retries * 100, 3000);
      },
    },
  });

  client.on('error', (err) => {
    console.error('Redis error:', err.message);
    isConnected = false;
  });

  client.on('connect', () => {
    isConnected = true;
    console.log('✅ Redis connected');
  });

  client.on('disconnect', () => {
    isConnected = false;
  });

  await client.connect();
  return client;
};

module.exports = { getRedisClient };
