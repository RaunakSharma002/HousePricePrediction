// const mongoose = require('mongoose');

// const houseSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   area_type: String,
//   availability: String,
//   location: String,
//   size: String,
//   society: String,
//   total_sqft: String,
//   bath: Number,
//   balcony: Number,
//   price: { type: Number, default: 0 },
//   images: [String],  // Array to store multiple image URLs
//   videos: [String],      // URL for video
//   amenities: [String],
//   seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   isAvailable: { type: Boolean, default: true }
// });

// module.exports = mongoose.model('House', houseSchema);

//-----------------------------------------------------------------------------------------

const mongoose = require('mongoose');
const reportSchema = require('./Report').schema;  // Import the report schema
const feedbackSchema = require('./Feedback').schema;  // Import the feedback schema

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
  price: { type: Number, default: 0 },
  images: [String],  // Array to store multiple image URLs
  videos: [String],      // URL for video
  amenities: [String],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isAvailable: { type: Boolean, default: true },
  reports: [reportSchema],  // Embedded reports
  feedbacks: [feedbackSchema],  // Embedded feedbacks
  averageRating: { type: Number, default: 0 },
});

module.exports = mongoose.model('House', houseSchema);

