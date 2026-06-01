const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  shopName:      { type: String, default: "HABIBI" },
  address:       { type: String, default: "" },
  phone:         { type: String, default: "" },
  email:         { type: String, default: "" },
  lat:           { type: Number, default: 0 },
  lng:           { type: Number, default: 0 },
  instagram:     { type: String, default: "" },
  galleryImages: [
    {
      image: { type: String, required: true },
      text:  { type: String, default: '' },
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
