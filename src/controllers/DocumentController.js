const path = require('path');
const fs = require('fs');
const DocumentService = require('../services/DocumentService');
const { sendSuccess } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');
const { ValidationError } = require('../exceptions');

const uploadDocument = asyncHandler(async (req, res) => {
  if (req.fileValidationError) {
    throw new ValidationError('File is required to be a PDF');
  }
  if (!req.file) {
    throw new ValidationError('File is required');
  }
  const document = await DocumentService.uploadDocument(req.user.id, req.file);
  return sendSuccess(res, document, 201, 'Document uploaded successfully');
});

const getAllDocuments = asyncHandler(async (req, res) => {
  const documents = await DocumentService.getAllDocuments();
  return sendSuccess(res, { documents });
});

const getDocumentById = asyncHandler(async (req, res) => {
  const document = await DocumentService.getDocumentById(req.params.id);
  return sendSuccess(res, document);
});

// Serve/stream the actual PDF file
const serveDocument = asyncHandler(async (req, res) => {
  const document = await DocumentService.getDocumentById(req.params.id);
  const filePath = document.file_path;

  if (!fs.existsSync(filePath)) {
    throw new ValidationError('File not found on server');
  }

  const filename = path.basename(filePath);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

const deleteDocument = asyncHandler(async (req, res) => {
  await DocumentService.deleteDocument(req.params.id, req.user.id);
  return sendSuccess(res, {}, 200, 'Document deleted successfully');
});

module.exports = {
  uploadDocument,
  getAllDocuments,
  getDocumentById,
  serveDocument,
  deleteDocument,
};
