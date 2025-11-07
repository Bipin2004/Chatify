const express = require('express');
const { register, login, getMe } = require('../controllers/userController');
const auth = require('../middleware/authmiddleware');
const { registerValidator, loginValidator } = require('../validators/userValidators');

const router = express.Router();
router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.get('/me', auth, getMe);

module.exports = router;
