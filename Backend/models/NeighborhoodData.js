const mongoose = require('mongoose');

const neighborhoodDataSchema = new mongoose.Schema({
  neighborhood: { type: String, required: true, unique: true }, // Location of the neighborhood
  annualGrowthRate: { type: Number, required: true }, // e.g., 0.05 for 5% annual growth
  historicalData: [
    {
      year: { type: Number, required: true }, // Year of the data
      priceIndex: { type: Number, required: true }, // Price index or average price for that year
    }
  ],
  projectedGrowthRate: { type: Number, default: 0 }, // Optional: project future growth, could be calculated based on historical data
  nearbyDevelopmentImpact: { type: Number, default: 0 }, // Potential impact of nearby developments (e.g., percentage increase)
  lastUpdated: { type: Date, default: Date.now } // The date when the neighborhood data was last updated
});

module.exports = mongoose.model('NeighborhoodData', neighborhoodDataSchema);
