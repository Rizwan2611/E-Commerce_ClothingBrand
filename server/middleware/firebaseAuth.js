const { admin } = require('../config/firebase');
const Customer = require('../models/Customer');
const asyncHandler = require('express-async-handler');

const firebaseAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('✅ Firebase Token Verified for:', decodedToken.email);
    
    // Find or create customer in our DB based on Firebase UID
    let customer = await Customer.findOne({ firebaseUid: decodedToken.uid });
    
    if (!customer) {
      // Check if user exists with the same email but no Firebase UID
      customer = await Customer.findOne({ email: decodedToken.email });
      
      if (customer) {
        // Link existing account with Firebase
        customer.firebaseUid = decodedToken.uid;
        await customer.save();
      } else {
        // Create new heritage profile
        customer = await Customer.create({
          firebaseUid: decodedToken.uid,
          name: decodedToken.name || decodedToken.email.split('@')[0],
          email: decodedToken.email,
          isActive: true
        });
      }
    }

    req.customer = customer;
    next();
  } catch (error) {
    console.error('❌ Firebase Auth Verification Failed:', error);
    res.status(401).json({ success: false, message: 'Not authorized, token failed: ' + error.message });
  }
});

module.exports = { firebaseAuth };
