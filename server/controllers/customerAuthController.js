const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const asyncHandler = require('express-async-handler');

const generateToken = (id) => {
  return jwt.sign({ id, role: 'customer' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc  Register a new customer
// @route POST /api/auth/register
// @access Public
const register = asyncHandler(async (req, res) => {
  // We use this route to sync the profile details AFTER Firebase auth creation
  const { name, phone } = req.body;
  
  if (req.customer) {
    req.customer.name = name || req.customer.name;
    req.customer.phone = phone || req.customer.phone;
    await req.customer.save();
  }

  res.status(200).json({
    success: true,
    customer: {
      _id: req.customer._id,
      name: req.customer.name,
      email: req.customer.email,
      phone: req.customer.phone,
    },
  });
});

// @desc  Login customer
// @route POST /api/auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const customer = await Customer.findOne({ email }).select('+password');
  if (!customer || !(await customer.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  if (!customer.isActive) {
    return res.status(403).json({ success: false, message: 'Account is deactivated' });
  }

  const token = generateToken(customer._id);

  res.json({
    success: true,
    token,
    customer: {
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    },
  });
});

// @desc  Get current customer profile
// @route GET /api/auth/me
// @access Private (Customer)
const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    customer: {
      _id: req.customer._id,
      name: req.customer.name,
      email: req.customer.email,
      phone: req.customer.phone,
      createdAt: req.customer.createdAt,
    },
  });
});

module.exports = { register, login, getMe };
