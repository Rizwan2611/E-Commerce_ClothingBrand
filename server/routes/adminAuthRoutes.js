const express = require('express');
const router = express.Router();
const { adminLogin, adminRegister, adminGoogleLogin, getAdminMe, setupAdmin } = require('../controllers/adminAuthController');
const { protectAdmin } = require('../middleware/adminAuth');

router.post('/setup', setupAdmin);
router.post('/login', adminLogin);
router.post('/register', adminRegister);
router.post('/google', adminGoogleLogin);
router.get('/me', protectAdmin, getAdminMe);

module.exports = router;
