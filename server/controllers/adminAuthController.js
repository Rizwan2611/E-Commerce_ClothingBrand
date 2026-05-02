const jwt = require('jsonwebtoken');
const Shopkeeper = require('../models/Shopkeeper');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateAdminToken = (id) => {
  return jwt.sign({ id, role: 'shopkeeper' }, process.env.ADMIN_JWT_SECRET, {
    expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || '1d',
  });
};

// @desc  Login shopkeeper (admin only route)
// @route POST /api/admin/auth/login
// @access Public
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const shopkeeper = await Shopkeeper.findOne({ email }).select('+password');
  if (!shopkeeper || !(await shopkeeper.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }

  if (!shopkeeper.isActive) {
    return res.status(403).json({ success: false, message: 'Admin account deactivated' });
  }

  const token = generateAdminToken(shopkeeper._id);

  res.json({
    success: true,
    token,
    shopkeeper: {
      _id: shopkeeper._id,
      name: shopkeeper.name,
      email: shopkeeper.email,
      role: shopkeeper.role,
    },
  });
};

// @desc  Register shopkeeper
// @route POST /api/admin/auth/register
// @access Public
const adminRegister = async (req, res) => {
  const { name, email, password, contact } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: 'Name, email and password are required' });
  }

  const existing = await Shopkeeper.findOne({ email });
  if (existing) {
    return res.status(400).json({ success: false, message: 'Admin account already exists with this email' });
  }

  // Create new shopkeeper
  const shopkeeper = await Shopkeeper.create({
    name,
    email,
    password,
    phone: contact || '',
    role: 'shopkeeper',
    isActive: true 
  });

  const token = generateAdminToken(shopkeeper._id);

  res.status(201).json({
    success: true,
    token,
    shopkeeper: {
      _id: shopkeeper._id,
      name: shopkeeper.name,
      email: shopkeeper.email,
      role: shopkeeper.role,
    },
  });
};

// @desc  Google Login for admin
// @route POST /api/admin/auth/google
// @access Public
const adminGoogleLogin = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, message: 'No Google token provided' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
       idToken: token,
       audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;
    const googleId = payload.sub;

    let shopkeeper = await Shopkeeper.findOne({ email });

    if (!shopkeeper) {
       const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).toUpperCase();
       
       shopkeeper = await Shopkeeper.create({
          name,
          email,
          googleId,
          password: randomPassword,
          role: 'shopkeeper',
          isActive: true
       });
    }

    if (!shopkeeper.isActive) {
      return res.status(403).json({ success: false, message: 'Admin account deactivated' });
    }

    const authToken = generateAdminToken(shopkeeper._id);

    res.json({
      success: true,
      token: authToken,
      shopkeeper: {
        _id: shopkeeper._id,
        name: shopkeeper.name,
        email: shopkeeper.email,
        role: shopkeeper.role,
      },
    });
  } catch (error) {
     console.error('Google Auth Error:', error);
     res.status(401).json({ success: false, message: 'Google Authentication Failed' });
  }
};

// @desc  Get admin profile
// @route GET /api/admin/auth/me
// @access Private (Admin)
const getAdminMe = async (req, res) => {
  res.json({
    success: true,
    shopkeeper: {
      _id: req.shopkeeper._id,
      name: req.shopkeeper.name,
      email: req.shopkeeper.email,
      role: req.shopkeeper.role,
      createdAt: req.shopkeeper.createdAt,
    },
  });
};

// @desc  Create initial admin (only for setup - disable after)
// @route POST /api/admin/auth/setup
// @access Public (but should be removed in production)
const setupAdmin = async (req, res) => {
  const count = await Shopkeeper.countDocuments();
  if (count > 0) {
    return res.status(403).json({ success: false, message: 'Admin already exists' });
  }

  const { name, email, password } = req.body;
  const shopkeeper = await Shopkeeper.create({ name, email, password, role: 'admin' });
  const token = generateAdminToken(shopkeeper._id);

  res.status(201).json({
    success: true,
    message: 'Admin created successfully',
    token,
    shopkeeper: { _id: shopkeeper._id, name: shopkeeper.name, email: shopkeeper.email },
  });
};

module.exports = { adminLogin, adminRegister, adminGoogleLogin, getAdminMe, setupAdmin };
