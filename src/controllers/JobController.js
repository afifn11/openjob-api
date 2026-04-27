const JobService = require('../services/JobService');
const { sendSuccess } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

// POST /jobs → data: { id, title, ... }  flat
const createJob = asyncHandler(async (req, res) => {
  const job = await JobService.createJob(req.body);
  return sendSuccess(res, job, 201, 'Job created successfully');
});

// GET /jobs?title=&company-name= → data: { jobs: [...] }
const getAllJobs = asyncHandler(async (req, res) => {
  const { title, 'company-name': companyName } = req.query;
  const jobs = await JobService.getAllJobs({ title, companyName });
  return sendSuccess(res, { jobs });
});

// GET /jobs/:id → data: { id, title, ... }  flat
const getJobById = asyncHandler(async (req, res) => {
  const job = await JobService.getJobById(req.params.id);
  return sendSuccess(res, job);
});

// GET /jobs/company/:companyId → data: { jobs: [...] }
const getJobsByCompany = asyncHandler(async (req, res) => {
  const jobs = await JobService.getJobsByCompany(req.params.companyId);
  return sendSuccess(res, { jobs });
});

// GET /jobs/category/:categoryId → data: { jobs: [...] }
const getJobsByCategory = asyncHandler(async (req, res) => {
  const jobs = await JobService.getJobsByCategory(req.params.categoryId);
  return sendSuccess(res, { jobs });
});

// PUT /jobs/:id → data: { id, title, ... }
const updateJob = asyncHandler(async (req, res) => {
  const job = await JobService.updateJob(req.params.id, req.body);
  return sendSuccess(res, job, 200, 'Job updated successfully');
});

// DELETE /jobs/:id → data: {}
const deleteJob = asyncHandler(async (req, res) => {
  await JobService.deleteJob(req.params.id);
  return sendSuccess(res, {}, 200, 'Job deleted successfully');
});

module.exports = { createJob, getAllJobs, getJobById, getJobsByCompany, getJobsByCategory, updateJob, deleteJob };
