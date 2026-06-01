const Settings = require('../models/Settings');
const { isAwsConfigured } = require('../config/s3');

const getSettingsDocument = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
};

const getShopSettings = async (req, res) => {
  const settings = await getSettingsDocument();
  res.json({ success: true, settings });
};

const updateShopSettings = async (req, res) => {
  try {
    const { shopName, address, phone, email, lat, lng, instagram } = req.body;
    let settings = await getSettingsDocument();
    
    if (shopName !== undefined) settings.shopName = shopName;
    if (address !== undefined) settings.address = address;
    if (phone !== undefined) settings.phone = phone;
    if (email !== undefined) settings.email = email;
    if (lat !== undefined) settings.lat = isNaN(parseFloat(lat)) ? 0 : parseFloat(lat);
    if (lng !== undefined) settings.lng = isNaN(parseFloat(lng)) ? 0 : parseFloat(lng);
    if (instagram !== undefined) settings.instagram = instagram;
    
    await settings.save();
    res.json({ success: true, settings });
  } catch (error) {
    console.error('Failed to update shop settings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/admin/gallery — upload one image to the gallery
const addGalleryImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No image uploaded' });

    const imageUrl = isAwsConfigured
      ? req.file.location                          // S3 URL
      : `/uploads/${req.file.filename}`;           // local fallback

    const text = req.body.text || '';

    let settings = await getSettingsDocument();
    settings.galleryImages.push({ image: imageUrl, text });
    await settings.save();

    res.json({ success: true, galleryImages: settings.galleryImages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/admin/gallery/:id — remove one gallery item by subdoc _id
const removeGalleryImage = async (req, res) => {
  try {
    let settings = await getSettingsDocument();
    settings.galleryImages = settings.galleryImages.filter(
      (img) => img._id.toString() !== req.params.id
    );
    await settings.save();
    res.json({ success: true, galleryImages: settings.galleryImages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getShopSettings, updateShopSettings, addGalleryImage, removeGalleryImage };
