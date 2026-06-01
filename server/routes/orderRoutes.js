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
  verifyOrderDelivery,
  sendTrackingLink
} = require('../controllers/orderController');
const { firebaseAuth: protect } = require('../middleware/firebaseAuth');
const { protectAdmin } = require('../middleware/adminAuth');

// Customer routes
router.post('/', protect, placeOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getMyOrder);
router.patch('/:id/cancel', protect, cancelOrder);
router.patch('/:id/verify', protect, verifyOrderDelivery);

// Admin routes (mounted separately)
router.get('/admin/all', protectAdmin, adminGetOrders);
router.patch('/admin/:id/status', protectAdmin, updateOrderStatus);
router.post('/admin/:id/send-tracking-link', protectAdmin, sendTrackingLink);
router.delete('/admin/:id', protectAdmin, deleteOrder);
router.get('/admin/analytics', protectAdmin, getAnalytics);

module.exports = router;
