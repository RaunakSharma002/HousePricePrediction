const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
  title: String,
  description: String,
  area_type: String,
  availability: String,
  location: String,
  size: String,
  society: String,
  total_sqft: String,
  bath: Number,
  balcony: Number,
  price: Number,
  images: [String],  // Array to store multiple image URLs
  videos: [String],      // URL for video
  amenities: [String],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isAvailable: { type: Boolean, default: true }
});

module.exports = mongoose.model('House', houseSchema);
