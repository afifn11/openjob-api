const fs = require('fs');
const path = require('path');
const DocumentRepository = require('../repositories/DocumentRepository');
const generateId = require('../utils/generateId');
const { AuthorizationError } = require('../exceptions');

class DocumentService {
  async uploadDocument(userId, file) {
    const id = generateId();
    const doc = await DocumentRepository.create({
      id,
      user_id: userId,
      original_name: file.originalname,
      name: path.basename(file.path),
      file_path: file.path,
      file_size: file.size,
    });
    // Return shape expected by Postman
    return {
      documentId: doc.id,
      filename: path.basename(doc.file_path),
      originalName: doc.name,
      size: doc.file_size,
      userId: doc.user_id,
      createdAt: doc.created_at,
    };
  }

  async getAllDocuments() {
    const docs = await DocumentRepository.findAll();
    return docs.map((d) => ({
      documentId: d.id,
      filename: path.basename(d.file_path),
      originalName: d.name,
      size: d.file_size,
      userId: d.user_id,
      createdAt: d.created_at,
    }));
  }

  async getDocumentById(id) {
    return DocumentRepository.findById(id);
  }

  async deleteDocument(id, userId) {
    const doc = await DocumentRepository.findById(id);
    if (doc.user_id !== userId) {
      throw new AuthorizationError('You are not authorized to delete this document');
    }
    if (fs.existsSync(doc.file_path)) {
      fs.unlinkSync(doc.file_path);
    }
    return DocumentRepository.delete(id);
  }
}

module.exports = new DocumentService();
