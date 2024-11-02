const mongoose = require("mongoose");

const PropertySchema  = new mongoose.Schema({
    location: String,
    total_sqft: Number,
    bath: Number,
    bhk: Number,
});

module.exports = mongoose.model('Property', PropertySchema);