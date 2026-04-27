const express = require('express');
const router = express.Router();
const { register, getUserById } = require('../controllers/UserController');
const validate = require('../middlewares/validationMiddleware');
const { registerUserSchema } = require('../validations/userValidation');

router.post('/', validate(registerUserSchema), register);
router.get('/:id', getUserById);

module.exports = router;
