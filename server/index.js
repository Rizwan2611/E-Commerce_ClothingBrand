require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const customerAuthRoutes = require('./routes/customerAuthRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Connect DB
connectDB();

const app = express();

// Security & middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static local uploads (fallback for AWS)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Shop info (public)
// Moved away from hardcoded environment variables
const Settings = require('./models/Settings');
app.get('/api/shop-info', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json({
      success: true,
      shop: {
        name: settings.shopName,
        tagline: "Premium Men's Clothing",
        lat: settings.lat,
        lng: settings.lng,
        address: settings.address,
        phone: settings.phone,
        email: settings.email,
        instagram: settings.instagram,
        hours: 'Mon-Sat: 10am - 9pm, Sun: 12pm - 7pm',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Errors' });
  }
});

// API routes
app.use('/api/auth', customerAuthRoutes);           // Customer auth
app.use('/api/admin/auth', adminAuthRoutes);        // Admin auth (isolated)
app.use('/api/products', productRoutes);            // Products (public + admin)
app.use('/api/orders', orderRoutes);                // Orders

// Admin product & order routes (cleaner separation)
const { protectAdmin } = require('./middleware/adminAuth');
const {
  adminGetProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
} = require('./controllers/productController');
const { adminGetOrders, updateOrderStatus, deleteOrder, getAnalytics } = require('./controllers/orderController');
const { upload } = require('./config/s3');

app.get('/api/admin/products', protectAdmin, adminGetProducts);
app.post('/api/admin/products', protectAdmin, upload.array('images', 5), createProduct);
app.put('/api/admin/products/:id', protectAdmin, upload.array('images', 5), updateProduct);
app.delete('/api/admin/products/:id', protectAdmin, deleteProduct);
app.delete('/api/admin/products/:id/images/:imageIndex', protectAdmin, deleteProductImage);

app.get('/api/admin/orders', protectAdmin, adminGetOrders);
app.patch('/api/admin/orders/:id/status', protectAdmin, updateOrderStatus);
app.delete('/api/admin/orders/:id', protectAdmin, deleteOrder);
app.get('/api/admin/analytics', protectAdmin, getAnalytics);

// Shop Settings
const { getShopSettings, updateShopSettings } = require('./controllers/settingsController');
app.get('/api/admin/settings', protectAdmin, getShopSettings);
app.put('/api/admin/settings', protectAdmin, updateShopSettings);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📦 Customer Auth: POST /api/auth/login`);
  console.log(`🔐 Admin Auth:    POST /api/admin/auth/login`);
  console.log(`🏥 Health Check:  GET  /api/health`);
});

module.exports = app;
