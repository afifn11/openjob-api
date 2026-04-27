const bcrypt = require('bcryptjs');
const UserRepository = require('../repositories/UserRepository');
const CacheService = require('./CacheService');
const generateId = require('../utils/generateId');

const CACHE_KEY = (id) => `user:${id}`;

class UserService {
  async register({ name, email, password, role, phone, address, bio }) {
    await UserRepository.checkEmailExists(email);
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = generateId();
    return UserRepository.create({ id, name, email, password: hashedPassword, role, phone, address, bio });
  }

  async getUserById(id, res) {
    const cacheKey = CACHE_KEY(id);
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      if (res) res.setHeader('X-Data-Source', 'cache');
      return cached;
    }
    const user = await UserRepository.findById(id);
    await CacheService.set(cacheKey, user);
    if (res) res.setHeader('X-Data-Source', 'database');
    return user;
  }

  async updateUser(id, payload) {
    const user = await UserRepository.update(id, payload);
    await CacheService.delete(CACHE_KEY(id));
    return user;
  }
}

module.exports = new UserService();
