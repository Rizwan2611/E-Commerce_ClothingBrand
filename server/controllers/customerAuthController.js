const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

const generateToken = (id) => {
  return jwt.sign({ id, role: 'customer' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc  Register a new customer
// @route POST /api/auth/register
// @access Public
const register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email and password are required' });
  }

  const existingCustomer = await Customer.findOne({ email });
  if (existingCustomer) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const customer = await Customer.create({ name, email, password, phone });
  const token = generateToken(customer._id);

  res.status(201).json({
    success: true,
    token,
    customer: {
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    },
  });
};

// @desc  Login customer
// @route POST /api/auth/login
// @access Public
const login = async (req, res) => {
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
};

// @desc  Get current customer profile
// @route GET /api/auth/me
// @access Private (Customer)
const getMe = async (req, res) => {
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
};

module.exports = { register, login, getMe };
