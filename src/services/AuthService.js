const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
const AuthRepository = require('../repositories/AuthRepository');
const generateId = require('../utils/generateId');
const { AuthenticationError, ValidationError } = require('../exceptions');

class AuthService {
  async login({ email, password }) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new AuthenticationError('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AuthenticationError('Invalid email or password');

    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: '3h' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_KEY,
      { expiresIn: '7d' }
    );

    const id = generateId();
    await AuthRepository.saveRefreshToken({ id, userId: user.id, refreshToken });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken) {
    // Invalid token signature or format → 400
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
    } catch (err) {
      throw new ValidationError('Invalid or expired refresh token');
    }

    // Token not found in DB (already deleted/logged out) → 400
    try {
      await AuthRepository.findByRefreshToken(refreshToken);
    } catch (err) {
      throw new ValidationError('Refresh token not found or already used');
    }

    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: '3h' }
    );

    return { accessToken };
  }

  async logout(refreshToken) {
    // Invalid token → 400
    try {
      await AuthRepository.deleteByRefreshToken(refreshToken);
    } catch (err) {
      throw new ValidationError('Refresh token not found');
    }
  }
}

module.exports = new AuthService();
