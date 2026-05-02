const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getMyOrder,
  cancelOrder,
  adminGetOrders,
  updateOrderStatus,
  deleteOrder,
  getAnalytics,
} = require('../controllers/orderController');
const { protect } = require('../middleware/customerAuth');
const { protectAdmin } = require('../middleware/adminAuth');

// Customer routes
router.post('/', protect, placeOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getMyOrder);
router.patch('/:id/cancel', protect, cancelOrder);

// Admin routes (mounted separately)
router.get('/admin/all', protectAdmin, adminGetOrders);
router.patch('/admin/:id/status', protectAdmin, updateOrderStatus);
router.delete('/admin/:id', protectAdmin, deleteOrder);
router.get('/admin/analytics', protectAdmin, getAnalytics);

module.exports = router;
