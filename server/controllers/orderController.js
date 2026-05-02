const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendNewOrderNotification, sendOrderCancelledNotification } = require('../services/whatsappService');

// @desc  Place a new order (customer)
// @route POST /api/orders
// @access Private (Customer)
const placeOrder = async (req, res) => {
  const { items, customerDetails, paymentMethod, notes } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'No items in order' });
  }

  // Validate products and calculate total
  let totalAmount = 0;
  const enrichedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product || !product.isActive) {
      return res.status(400).json({ success: false, message: `Product not found: ${item.productId}` });
    }

    const itemTotal = product.price * item.quantity;
    totalAmount += itemTotal;
    enrichedItems.push({
      product: product._id,
      title: product.title,
      price: product.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      image: product.images[0]?.url || '',
    });
  }

  const order = await Order.create({
    customer: req.customer._id,
    customerDetails: {
      name: customerDetails.name || req.customer.name,
      email: customerDetails.email || req.customer.email,
      phone: customerDetails.phone,
      address: customerDetails.address,
    },
    items: enrichedItems,
    totalAmount,
    paymentMethod: paymentMethod || 'cod',
    notes,
    statusHistory: [{ status: 'pending' }],
  });

  // Send WhatsApp notification
  try {
    const notifResult = await sendNewOrderNotification(order);
    order.whatsappNotified = notifResult.success;
    await order.save();
  } catch (err) {
    console.error('WhatsApp notification error:', err);
  }

  res.status(201).json({ success: true, order });
};

// @desc  Get customer's own orders
// @route GET /api/orders/my
// @access Private (Customer)
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ customer: req.customer._id })
    .sort('-createdAt')
    .populate('items.product', 'title images');

  res.json({ success: true, orders });
};

// @desc  Get single order for customer
// @route GET /api/orders/:id
// @access Private (Customer)
const getMyOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, customer: req.customer._id });
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, order });
};

// @desc  Cancel order (customer)
// @route PATCH /api/orders/:id/cancel
// @access Private (Customer)
const cancelOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, customer: req.customer._id });
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (!['pending', 'confirmed'].includes(order.status)) {
    return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
  }

  order.status = 'cancelled';
  order.cancelledBy = 'customer';
  await order.save();

  // Send WhatsApp notification for cancellation
  try {
    await sendOrderCancelledNotification(order);
  } catch (err) {
    console.error('WhatsApp cancel notification error:', err);
  }

  res.json({ success: true, message: 'Order cancelled successfully', order });
};

// ========== ADMIN ORDER CONTROLLERS ==========

// @desc  Get all orders (admin)
// @route GET /api/admin/orders
// @access Private (Admin)
const adminGetOrders = async (req, res) => {
  const { status, page = 1, limit = 20, startDate, endDate } = req.query;
  const query = {};

  if (status) query.status = status;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .populate('customer', 'name email'),
    Order.countDocuments(query),
  ]);

  res.json({
    success: true,
    orders,
    pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
  });
};

// @desc  Update order status (admin)
// @route PATCH /api/admin/orders/:id/status
// @access Private (Admin)
const updateOrderStatus = async (req, res) => {
  const { status, note } = req.body;
  const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const previousStatus = order.status;
  order.status = status;
  if (status === 'cancelled') order.cancelledBy = 'shopkeeper';
  order.statusHistory.push({ status, note: note || '' });
  await order.save();

  // Send WhatsApp notification if cancelled by shopkeeper
  if (status === 'cancelled' && previousStatus !== 'cancelled') {
    try {
      await sendOrderCancelledNotification(order);
    } catch (err) {
      console.error('WhatsApp cancel notification error:', err);
    }
  }

  res.json({ success: true, order });
};

// @desc  Delete order (admin)
// @route DELETE /api/orders/admin/:id
// @access Private (Admin)
const deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  await Order.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Order deleted successfully' });
};

// @desc  Get analytics dashboard data
// @route GET /api/admin/analytics
// @access Private (Admin)
const getAnalytics = async (req, res) => {
  const { period = 'monthly' } = req.query;
  const now = new Date();
  let startDate;
  let groupFormat;

  if (period === 'weekly') {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    groupFormat = '%Y-%m-%d';
  } else if (period === 'monthly') {
    startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    groupFormat = '%Y-%m';
  } else {
    // yearly
    startDate = new Date(now.getFullYear() - 4, 0, 1);
    groupFormat = '%Y';
  }

  const [salesData, statusBreakdown, totalStats, recentOrders] = await Promise.all([
    // Revenue & orders over time
    Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    // Order status breakdown
    Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),

    // Overall totals
    Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $cond: [{ $ne: ['$status', 'cancelled'] }, '$totalAmount', 0] } },
          totalOrders: { $sum: 1 },
          deliveredOrders: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
          pendingOrders: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          cancelledOrders: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
        },
      },
    ]),

    // Recent orders
    Order.find().sort('-createdAt').limit(5).populate('customer', 'name email'),
  ]);

  res.json({
    success: true,
    analytics: {
      salesData,
      statusBreakdown,
      totals: totalStats[0] || {
        totalRevenue: 0,
        totalOrders: 0,
        deliveredOrders: 0,
        pendingOrders: 0,
        cancelledOrders: 0,
      },
      recentOrders,
      period,
    },
  });
};

module.exports = {
  placeOrder,
  getMyOrders,
  getMyOrder,
  cancelOrder,
  adminGetOrders,
  updateOrderStatus,
  deleteOrder,
  getAnalytics,
};
