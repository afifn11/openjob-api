const ApplicationRepository = require('../repositories/ApplicationRepository');
const CacheService = require('./CacheService');
const MessageService = require('./MessageService');
const generateId = require('../utils/generateId');

const CACHE_KEY_DETAIL = (id) => `application:${id}`;
const CACHE_KEY_BY_USER = (userId) => `applications:user:${userId}`;
const CACHE_KEY_BY_JOB = (jobId) => `applications:job:${jobId}`;

class ApplicationService {
  async createApplication(userId, { job_id, cover_letter }) {
    const id = generateId();
    const application = await ApplicationRepository.create({
      id, user_id: userId, job_id, cover_letter,
    });
    await CacheService.delete(CACHE_KEY_BY_USER(userId));
    await CacheService.delete(CACHE_KEY_BY_JOB(job_id));
    await MessageService.publishApplicationCreated(id);
    return application;
  }

  async getAllApplications() {
    return ApplicationRepository.findAll();
  }

  async getApplicationById(id, res) {
    const cacheKey = CACHE_KEY_DETAIL(id);
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      if (res) res.setHeader('X-Data-Source', 'cache');
      return cached;
    }
    const application = await ApplicationRepository.findById(id);
    await CacheService.set(cacheKey, application);
    if (res) res.setHeader('X-Data-Source', 'database');
    return application;
  }

  async getApplicationsByUser(userId, res) {
    const cacheKey = CACHE_KEY_BY_USER(userId);
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      if (res) res.setHeader('X-Data-Source', 'cache');
      return cached;
    }
    const applications = await ApplicationRepository.findByUserId(userId);
    await CacheService.set(cacheKey, applications);
    if (res) res.setHeader('X-Data-Source', 'database');
    return applications;
  }

  async getApplicationsByJob(jobId, res) {
    const cacheKey = CACHE_KEY_BY_JOB(jobId);
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      if (res) res.setHeader('X-Data-Source', 'cache');
      return cached;
    }
    const applications = await ApplicationRepository.findByJobId(jobId);
    await CacheService.set(cacheKey, applications);
    if (res) res.setHeader('X-Data-Source', 'database');
    return applications;
  }

  async updateApplicationStatus(id, status) {
    const application = await ApplicationRepository.updateStatus(id, status);
    const detail = await ApplicationRepository.findById(id);
    await CacheService.delete(CACHE_KEY_DETAIL(id));
    await CacheService.delete(CACHE_KEY_BY_USER(detail.user_id));
    await CacheService.delete(CACHE_KEY_BY_JOB(detail.job_id));
    return application;
  }

  async deleteApplication(id) {
    // Get detail first to invalidate user/job caches
    let detail = null;
    try {
      detail = await ApplicationRepository.findById(id);
    } catch (_) {
      // not found - will throw in delete
    }
    const result = await ApplicationRepository.delete(id);
    // Invalidate all related caches
    await CacheService.delete(CACHE_KEY_DETAIL(id));
    if (detail) {
      await CacheService.delete(CACHE_KEY_BY_USER(detail.user_id));
      await CacheService.delete(CACHE_KEY_BY_JOB(detail.job_id));
    }
    return result;
  }
}

module.exports = new ApplicationService();
