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

// ⚠️ IMPORTANT: Static routes MUST come before dynamic /:id routes
// Admin routes (static paths first to avoid /:id shadowing)
router.get('/admin/all', protectAdmin, adminGetOrders);
router.get('/admin/analytics', protectAdmin, getAnalytics);
router.patch('/admin/:id/status', protectAdmin, updateOrderStatus);
router.post('/admin/:id/send-tracking-link', protectAdmin, sendTrackingLink);
router.delete('/admin/:id', protectAdmin, deleteOrder);

// Customer static routes (before /:id)
router.post('/', protect, placeOrder);
router.get('/my', protect, getMyOrders);

// Customer dynamic routes (/:id last)
router.get('/:id', protect, getMyOrder);
router.patch('/:id/cancel', protect, cancelOrder);
router.patch('/:id/verify', protect, verifyOrderDelivery);

module.exports = router;
