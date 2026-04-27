const { getRedisClient } = require('../config/redis');

const CACHE_TTL = 3600; // 1 hour

class CacheService {
  async get(key) {
    try {
      const client = await getRedisClient();
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Cache GET error:', err.message);
      return null;
    }
  }

  async set(key, value, ttl = CACHE_TTL) {
    try {
      const client = await getRedisClient();
      await client.setEx(key, ttl, JSON.stringify(value));
    } catch (err) {
      console.error('Cache SET error:', err.message);
    }
  }

  async delete(key) {
    try {
      const client = await getRedisClient();
      await client.del(key);
    } catch (err) {
      console.error('Cache DEL error:', err.message);
    }
  }

  async deleteByPattern(pattern) {
    try {
      const client = await getRedisClient();
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(keys);
      }
    } catch (err) {
      console.error('Cache DEL pattern error:', err.message);
    }
  }
}

module.exports = new CacheService();
