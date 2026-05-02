const Settings = require('../models/Settings');

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
  const { shopName, address, phone, email, lat, lng, instagram } = req.body;
  let settings = await getSettingsDocument();
  
  if (shopName !== undefined) settings.shopName = shopName;
  if (address !== undefined) settings.address = address;
  if (phone !== undefined) settings.phone = phone;
  if (email !== undefined) settings.email = email;
  if (lat !== undefined) settings.lat = parseFloat(lat);
  if (lng !== undefined) settings.lng = parseFloat(lng);
  if (instagram !== undefined) settings.instagram = instagram;
  
  await settings.save();
  res.json({ success: true, settings });
};

module.exports = { getShopSettings, updateShopSettings };
