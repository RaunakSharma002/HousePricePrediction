const mongoose = require('mongoose');

const userInteractionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  property_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  time_spent: {
    type: Number,
    default: 0, // Time spent in seconds
  },
  favorited: {
    type: Boolean,
    default: false,
  },
  skipped: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('UserInteraction', userInteractionSchema);

