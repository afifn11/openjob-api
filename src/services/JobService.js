const JobRepository = require('../repositories/JobRepository');
const generateId = require('../utils/generateId');

class JobService {
  async createJob(payload) {
    const id = generateId();
    return JobRepository.create({ id, ...payload });
  }

  async getAllJobs(filters) {
    return JobRepository.findAll(filters);
  }

  async getJobById(id) {
    return JobRepository.findById(id);
  }

  async getJobsByCompany(companyId) {
    return JobRepository.findByCompanyId(companyId);
  }

  async getJobsByCategory(categoryId) {
    return JobRepository.findByCategoryId(categoryId);
  }

  async updateJob(id, payload) {
    return JobRepository.update(id, payload);
  }

  async deleteJob(id) {
    return JobRepository.delete(id);
  }
}

module.exports = new JobService();
