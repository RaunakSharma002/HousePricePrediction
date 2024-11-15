const express = require('express');
const House = require('../models/House');
const Transaction = require('../models/Transaction');
const NeighborhoodData = require('../models/NeighborhoodData');  // Corrected spelling from NeighbhorhoodData


const router = express.Router();


router.post('/buy', async (req, res) => {
  const { houseId, userId, purchaseDate } = req.body;

  try {
    const house = await House.findById(houseId);

    if (!house || !house.isAvailable) {
      return res.status(400).json({ success: false, message: 'House is not available' });
    }

    // Record the transaction
    const transaction = new Transaction({
      house: houseId,
      buyer: userId,
      purchaseDate: new Date(purchaseDate),
      location: house.location,
      price: house.price,
    });

    await transaction.save();

    // Update the house availability to false
    house.isAvailable = false;
    await house.save();

    // Fetch the existing neighborhood data for AI insights
    let neighborhoodData = await NeighborhoodData.findOne({ neighborhood: house.location });

    if (!neighborhoodData) {
      // If neighborhood data does not exist, create new neighborhood data
      neighborhoodData = new NeighborhoodData({
        neighborhood: house.location,
        annualGrowthRate: 0.05, // Default growth rate for new neighborhoods
        nearbyDevelopmentImpact: 0.0, // Default value, can be updated later
        historicalData: [],
      });
    }

    const currentYear = new Date(purchaseDate).getFullYear();
    let averagePriceCurrentYear = 0;
    let previousAveragePrice = 0;

    // Calculate the average price for the current year and the previous year
    const currentYearData = neighborhoodData.historicalData.filter(
      (data) => data.year === currentYear
    );
    const previousYearData = neighborhoodData.historicalData.filter(
      (data) => data.year === currentYear - 1
    );

    // Calculate average price for the current year
    if (currentYearData.length > 0) {
      averagePriceCurrentYear = currentYearData.reduce((sum, data) => sum + data.priceIndex, 0) / currentYearData.length;
    }

    // Calculate average price for the previous year
    if (previousYearData.length > 0) {
      previousAveragePrice = previousYearData.reduce((sum, data) => sum + data.priceIndex, 0) / previousYearData.length;
    }

    // If previous year's data exists, calculate growth rate
    if (previousAveragePrice > 0) {
      const priceChange = averagePriceCurrentYear - previousAveragePrice;
      let growthRate = (priceChange / previousAveragePrice) * 100; // Growth rate in percentage

      // If the growth rate is negative, set it to 0
      if (growthRate < 0) {
        growthRate = 0;
      }

      // Update the annual growth rate
      neighborhoodData.annualGrowthRate = growthRate;
    }

    // Record the transaction year and price index in historical data
    const newHistoricalData = {
      year: currentYear,
      priceIndex: house.price,  // Storing the price index or actual price
    };
    neighborhoodData.historicalData.push(newHistoricalData);

    // Calculate updated projected growth rate after the transaction
    const updatedGrowthRate = neighborhoodData.annualGrowthRate + neighborhoodData.nearbyDevelopmentImpact;
    neighborhoodData.projectedGrowthRate = updatedGrowthRate;
    neighborhoodData.lastUpdated = Date.now();

    // Save updated or newly created neighborhood data
    await neighborhoodData.save();

    return res.status(200).json({ success: true, message: 'Transaction successful!' });
  } catch (error) {
    console.error('Error processing transaction:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;
