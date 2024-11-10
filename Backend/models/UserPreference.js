const mongoose = require('mongoose');

const userPreferenceSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property_type_preferences: [{ type: String }],  // Array of property types based on interactions
  preferred_locations: [{ type: String }],  // Array of preferred locations
  budget_range: { min: Number, max: Number },  // Current budget range based on searches
  last_updated: { type: Date, default: Date.now },  // Timestamp for last interaction update
}, {
  timestamps: true,
});

module.exports = mongoose.model('UserPreference', userPreferenceSchema);
