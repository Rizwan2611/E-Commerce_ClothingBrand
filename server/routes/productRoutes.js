const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  adminGetProducts,
  createProductReview,
} = require('../controllers/productController');
const { protect } = require('../middleware/customerAuth');
const { protectAdmin } = require('../middleware/adminAuth');
const { upload } = require('../config/s3');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Customer protected routes
router.post('/:id/reviews', protect, createProductReview);

// Admin routes (mounted under /api/admin/products)
router.post('/admin', protectAdmin, upload.array('images', 5), createProduct);
router.get('/admin/all', protectAdmin, adminGetProducts);
router.put('/admin/:id', protectAdmin, upload.array('images', 5), updateProduct);
router.delete('/admin/:id', protectAdmin, deleteProduct);
router.delete('/admin/:id/images/:imageIndex', protectAdmin, deleteProductImage);

module.exports = router;
