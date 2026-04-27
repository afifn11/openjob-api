const express = require('express');
const router = express.Router();
const { login, refreshToken, logout } = require('../controllers/AuthController');
const validate = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { loginSchema, refreshTokenSchema, deleteAuthSchema } = require('../validations/authValidation');

router.post('/', validate(loginSchema), login);
router.put('/', validate(refreshTokenSchema), refreshToken);
router.delete('/', validate(deleteAuthSchema), logout);

module.exports = router;
