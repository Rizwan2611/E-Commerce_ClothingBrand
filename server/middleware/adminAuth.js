const jwt = require('jsonwebtoken');
const Shopkeeper = require('../models/Shopkeeper');

const protectAdmin = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Admin access denied, no token' });
    }

    // Uses a DIFFERENT secret than customer JWT
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    const shopkeeper = await Shopkeeper.findById(decoded.id);

    if (!shopkeeper || !shopkeeper.isActive) {
      return res.status(401).json({ success: false, message: 'Shopkeeper not found or inactive' });
    }

    req.shopkeeper = shopkeeper;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Admin access denied, token failed' });
  }
};

module.exports = { protectAdmin };
