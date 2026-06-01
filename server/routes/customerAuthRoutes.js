const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/customerAuthController');
const { firebaseAuth: protect } = require('../middleware/firebaseAuth');

router.post('/register', protect, register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
