const ApplicationService = require('../services/ApplicationService');
const { sendSuccess } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const createApplication = asyncHandler(async (req, res) => {
  const application = await ApplicationService.createApplication(req.user.id, req.body);
  return sendSuccess(res, application, 201, 'Application submitted successfully');
});

const getAllApplications = asyncHandler(async (req, res) => {
  const applications = await ApplicationService.getAllApplications();
  return sendSuccess(res, { applications });
});

const getApplicationById = asyncHandler(async (req, res) => {
  const application = await ApplicationService.getApplicationById(req.params.id, res);
  return sendSuccess(res, application);
});

const getApplicationsByUser = asyncHandler(async (req, res) => {
  const applications = await ApplicationService.getApplicationsByUser(req.params.userId, res);
  return sendSuccess(res, { applications });
});

const getApplicationsByJob = asyncHandler(async (req, res) => {
  const applications = await ApplicationService.getApplicationsByJob(req.params.jobId, res);
  return sendSuccess(res, { applications });
});

const updateApplication = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const application = await ApplicationService.updateApplicationStatus(req.params.id, status);
  return sendSuccess(res, application, 200, 'Application status updated');
});

const deleteApplication = asyncHandler(async (req, res) => {
  await ApplicationService.deleteApplication(req.params.id);
  return sendSuccess(res, {}, 200, 'Application deleted successfully');
});

module.exports = {
  createApplication,
  getAllApplications,
  getApplicationById,
  getApplicationsByUser,
  getApplicationsByJob,
  updateApplication,
  deleteApplication,
};
