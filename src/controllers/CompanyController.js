const CompanyService = require('../services/CompanyService');
const { sendSuccess } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const createCompany = asyncHandler(async (req, res) => {
  const company = await CompanyService.createCompany(req.user.id, req.body);
  return sendSuccess(res, company, 201, 'Company created successfully');
});

const getAllCompanies = asyncHandler(async (req, res) => {
  const companies = await CompanyService.getAllCompanies();
  return sendSuccess(res, { companies });
});

const getCompanyById = asyncHandler(async (req, res) => {
  const company = await CompanyService.getCompanyById(req.params.id, res);
  return sendSuccess(res, company);
});

const updateCompany = asyncHandler(async (req, res) => {
  const company = await CompanyService.updateCompany(req.params.id, req.body);
  return sendSuccess(res, company, 200, 'Company updated successfully');
});

const deleteCompany = asyncHandler(async (req, res) => {
  await CompanyService.deleteCompany(req.params.id);
  return sendSuccess(res, {}, 200, 'Company deleted successfully');
});

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
