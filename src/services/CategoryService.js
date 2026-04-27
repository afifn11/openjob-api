const CategoryRepository = require('../repositories/CategoryRepository');
const generateId = require('../utils/generateId');

class CategoryService {
  async createCategory(payload) {
    const id = generateId();
    return CategoryRepository.create({ id, ...payload });
  }

  async getAllCategories() {
    return CategoryRepository.findAll();
  }

  async getCategoryById(id) {
    return CategoryRepository.findById(id);
  }

  async updateCategory(id, payload) {
    return CategoryRepository.update(id, payload);
  }

  async deleteCategory(id) {
    return CategoryRepository.delete(id);
  }
}

module.exports = new CategoryService();
