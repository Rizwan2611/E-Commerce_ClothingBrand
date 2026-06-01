const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProductReview,
} = require('../controllers/productController');
const { firebaseAuth: protect } = require('../middleware/firebaseAuth');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Customer protected routes
router.post('/:id/reviews', protect, createProductReview);

// NOTE: Admin product routes are mounted directly in index.js
// under /api/admin/products using the protectAdmin middleware

module.exports = router;
