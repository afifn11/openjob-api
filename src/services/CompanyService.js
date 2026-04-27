const CompanyRepository = require('../repositories/CompanyRepository');
const CacheService = require('./CacheService');
const generateId = require('../utils/generateId');

const CACHE_KEY = (id) => `company:${id}`;

class CompanyService {
  async createCompany(userId, payload) {
    const id = generateId();
    const company = await CompanyRepository.create({ id, userId, ...payload });
    return company;
  }

  async getAllCompanies() {
    return CompanyRepository.findAll();
  }

  async getCompanyById(id, res) {
    const cacheKey = CACHE_KEY(id);
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      res.setHeader('X-Data-Source', 'cache');
      return cached;
    }
    const company = await CompanyRepository.findById(id);
    await CacheService.set(cacheKey, company);
    res.setHeader('X-Data-Source', 'database');
    return company;
  }

  async updateCompany(id, payload) {
    const company = await CompanyRepository.update(id, payload);
    // Invalidate cache
    await CacheService.delete(CACHE_KEY(id));
    return company;
  }

  async deleteCompany(id) {
    const result = await CompanyRepository.delete(id);
    await CacheService.delete(CACHE_KEY(id));
    return result;
  }
}

module.exports = new CompanyService();
