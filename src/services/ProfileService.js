const UserRepository = require('../repositories/UserRepository');
const ApplicationRepository = require('../repositories/ApplicationRepository');
const BookmarkRepository = require('../repositories/BookmarkRepository');

class ProfileService {
  async getProfile(userId) {
    return UserRepository.findById(userId);
  }

  async getMyApplications(userId) {
    return ApplicationRepository.findByUserId(userId);
  }

  async getMyBookmarks(userId) {
    return BookmarkRepository.findByUserId(userId);
  }
}

module.exports = new ProfileService();
