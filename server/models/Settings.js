const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  shopName: { type: String, default: "The Men's Collection" },
  address: { type: String, default: "123 Fashion Street, Karachi, Pakistan" },
  phone: { type: String, default: "+92 300 0000000" },
  email: { type: String, default: "info@menscollection.pk" },
  lat: { type: Number, default: 24.8607 },
  lng: { type: Number, default: 67.0011 },
  instagram: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
