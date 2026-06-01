const Product = require('../models/Product');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client } = require('../config/s3');
const asyncHandler = require('express-async-handler');

// @desc  Get all products (public)
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  const { category, subCategory, search, page = 1, limit = 12, sort = '-createdAt' } = req.query;
  const query = { isActive: true };

  if (category) query.category = category;
  if (subCategory) query.subCategory = subCategory;
  if (search) query.$text = { $search: search };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [products, total] = await Promise.all([
    Product.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    products,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit),
    },
  });
});

// @desc  Get single product (public)
// @route GET /api/products/:id
// @access Public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, isActive: true });
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, product });
});

// @desc  Create product
// @route POST /api/admin/products
// @access Private (Admin)
const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, category, subCategory, sizes, colors, stock, tags } = req.body;

  const images = req.files
    ? req.files.map((file) => ({
        url: file.location || `http://localhost:5001/uploads/${file.filename}`,
        key: file.key || file.filename,
      }))
    : [];

  const product = await Product.create({
    title,
    description,
    price: parseFloat(price),
    category,
    subCategory: subCategory || '',
    sizes: sizes ? JSON.parse(sizes) : [],
    colors: colors ? JSON.parse(colors) : [],
    stock: parseInt(stock) || 0,
    tags: tags ? JSON.parse(tags) : [],
    images,
  });

  res.status(201).json({ success: true, product });
});

// @desc  Update product
// @route PUT /api/admin/products/:id
// @access Private (Admin)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const { title, description, price, category, subCategory, sizes, colors, stock, tags, isActive } = req.body;

  // Handle new images
  let images = product.images;
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file) => ({ 
      url: file.location || `http://localhost:5001/uploads/${file.filename}`, 
      key: file.key || file.filename 
    }));
    images = [...images, ...newImages];
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      title: title || product.title,
      description: description || product.description,
      price: price ? parseFloat(price) : product.price,
      category: category || product.category,
      subCategory: subCategory !== undefined ? subCategory : product.subCategory,
      sizes: sizes ? JSON.parse(sizes) : product.sizes,
      colors: colors ? JSON.parse(colors) : product.colors,
      stock: stock !== undefined ? parseInt(stock) : product.stock,
      tags: tags ? JSON.parse(tags) : product.tags,
      isActive: isActive !== undefined ? isActive : product.isActive,
      images,
    },
    { new: true, runValidators: true }
  );

  res.json({ success: true, product: updatedProduct });
});

// @desc  Delete product
// @route DELETE /api/admin/products/:id
// @access Private (Admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Delete images from S3
  if (product.images && product.images.length > 0) {
    const deletePromises = product.images
      .filter((img) => img.key)
      .map(async (img) => {
        if (s3Client) {
          return s3Client.send(
            new DeleteObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: img.key,
            })
          );
        } else {
          const fs = require('fs');
          const path = require('path');
          const filePath = path.join(__dirname, '..', 'uploads', img.key);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          return Promise.resolve();
        }
      });
    await Promise.allSettled(deletePromises);
  }

  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted successfully' });
});

// @desc  Delete product image
// @route DELETE /api/admin/products/:id/images/:imageIndex
// @access Private (Admin)
const deleteProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const imageIndex = parseInt(req.params.imageIndex);
  const image = product.images[imageIndex];

  if (!image) {
    return res.status(404).json({ success: false, message: 'Image not found' });
  }

  if (image.key) {
    if (s3Client) {
      await s3Client.send(
        new DeleteObjectCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: image.key })
      );
    } else {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, '..', 'uploads', image.key);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  }

  product.images.splice(imageIndex, 1);
  await product.save();

  res.json({ success: true, product });
});

// @desc  Get all products for admin (including inactive)
// @route GET /api/admin/products
// @access Private (Admin)
const adminGetProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, category, subCategory, search } = req.query;
  const query = {};
  if (category) query.category = category;
  if (subCategory) query.subCategory = subCategory;
  if (search) query.$text = { $search: search };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [products, total] = await Promise.all([
    Product.find(query).sort('-createdAt').skip(skip).limit(parseInt(limit)),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    products,
    pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
  });
});

// @desc  Create product review
// @route POST /api/products/:id/reviews
// @access Private
const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    return res.status(400).json({ success: false, message: 'Product already reviewed' });
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.averageRating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ success: true, message: 'Review added' });
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  adminGetProducts,
  createProductReview,
};
