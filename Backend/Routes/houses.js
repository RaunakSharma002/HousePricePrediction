// Create a new house listing with images and video
// router.post('/', authMiddleware, upload.fields([{ name: 'images' }, { name: 'video' }]), async (req, res) => {
//   try {
//     const { title, description, area_type, availability, location, size, society, total_sqft, bath, balcony, price } = req.body;
//     const images = req.files['images'] ? req.files['images'].map(file => file.path) : [];
//     const video = req.files['video'] ? req.files['video'][0].path : null;

//     const house = new House({
//       title,
//       description,
//       area_type,
//       availability,
//       location,
//       size,
//       society,
//       total_sqft,
//       bath,
//       balcony,
//       price,
//       images,
//       video,
//       seller: req.user.id
//     });

//     await house.save();
//     res.status(201).json(house);
//   } catch (error) {
//     console.error("Error creating house listing:", error);
//     res.status(500).json({ error: 'Failed to create listing' });
//   }
// });

// Get all houses
// router.get('/', async (req, res) => {
//   try {
//     const houses = await House.find().populate('seller', 'name');
//     res.json(houses);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch houses' });
//   }
// });

// router.get('/', async (req, res) => {
//   try {
//     const { search, area_type, minPrice, maxPrice } = req.query;
//     let query = { isAvailable: true };  // Assuming you only want to show available houses

//     if (search) {
//       query.$or = [
//         { title: new RegExp(search, 'i') },
//         { location: new RegExp(search, 'i') }
//       ];
//     }
//     if (area_type) query.area_type = area_type;
//     if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
//     if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };

//     const houses = await House.find(query).populate('seller', 'name');
//     res.json(houses);
//   } catch (error) {
//     console.error("Error fetching houses:", error);
//     res.status(500).json({ error: 'Failed to fetch houses' });
//   }
// });

// routes/houses.js


//------------------------------------------------------------------------------------

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const House = require('../models/House');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../Middleware/authMiddleware');
const axios = require('axios');
const UserPreference = require('../models/UserPreference');
const UserInteraction = require('../models/UserInteraction');
// const House = require('../models/House');
const Report = require('../models/Report');
const Feedback = require('../models/Feedback');
require('dotenv').config();
const cosineSimilarity = require('cosine-similarity');
const NeighborhoodData = require('../models/NeighborhoodData');



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'houses',
    resource_type: 'auto'
  }
});

const upload = multer({ storage });
const router = express.Router();



// Create a new house listing with images and video
// router.post('/', upload.fields([{ name: 'images' }, { name: 'videos' }]), async (req, res) => {
//   try {
//     const { title, description, area_type, availability, location, size, society, total_sqft, bath, balcony, price } = req.body;
//     const images = req.files['images'] ? req.files['images'].map(file => file.path) : [];
//     // const video = req.files['video'] ? req.files['video'][0].path : null;
//     const videos = req.files['videos'] ? req.files['videos'].map(file => file.path) : [];


//     const house = new House({
//       title,
//       description,
//       area_type,
//       availability,
//       location,
//       size,
//       society,
//       total_sqft,
//       bath,
//       balcony,
//       price,
//       images,
//       videos,
//       // seller: req.user.id
//     });

//     await house.save();
//     res.status(201).json(house);
//   } catch (error) {
//     console.error("Error creating house listing:", error);
//     res.status(500).json({ error: 'Failed to create listing' });
//   }
// });

router.post('/', upload.fields([{ name: 'images' }, { name: 'videos' }]), async (req, res) => {
  try {
    const { title, description, area_type, availability, location, size, society, total_sqft, bath, balcony, price, amenities } = req.body;
    const images = req.files['images'] ? req.files['images'].map(file => file.path) : [];
    const videos = req.files['videos'] ? req.files['videos'].map(file => file.path) : [];

    const house = new House({
      title,
      description,
      area_type,
      availability,
      location,
      size,
      society,
      total_sqft,
      bath,
      balcony,
      price,
      images,
      videos,
      amenities: amenities ? amenities.split(',') : [], // Store amenities as an array
    });

    await house.save();
    res.status(201).json(house);
  } catch (error) {
    console.error("Error creating house listing:", error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});


// Update time spent for a user and a property
router.post('/:houseId/updateTimeSpent', async (req, res) => {
  const { houseId } = req.params;
  const { userId, timeSpent } = req.body;

  try {
    let interaction = await UserInteraction.findOne({ user_id: userId, property_id: houseId });

    if (interaction) {
      interaction.time_spent += timeSpent; // Increment time spent
      await interaction.save();
    } else {
      // Create new interaction if not found
      interaction = new UserInteraction({
        user_id: userId,
        property_id: houseId,
        time_spent: timeSpent,
      });
      await interaction.save();
    }

    res.status(200).json({ message: 'Time spent updated successfully' });
  } catch (error) {
    console.error("Error updating time spent:", error);
    res.status(500).json({ error: 'Failed to update time spent' });
  }
});


// Toggle favorite status of a house for a user
router.post('/:houseId/favorite', async (req, res) => {
  const { houseId } = req.params;
  const { userId } = req.body;

  try {
    let interaction = await UserInteraction.findOne({ user_id: userId, property_id: houseId });

    if (interaction) {
      interaction.favorited = !interaction.favorited; // Toggle favorite status
    } else {
      interaction = new UserInteraction({
        user_id: userId,
        property_id: houseId,
        favorited: true, // Default to true for new interactions
      });
    }

    await interaction.save();
    res.status(200).json({ message: 'House favorited successfully', favorited: interaction.favorited });
  } catch (error) {
    console.error("Error favoriting house:", error);
    res.status(500).json({ error: 'Failed to favorite house' });
  }
});


//Making a new Instace of userInteractionn
router.post('/:houseId/interaction', async (req, res) => {
  const { houseId } = req.params;
  const { userId } = req.body;

  if (!houseId || !userId) {
    return res.status(400).json({ error: 'houseId and userId are required' });
  }

  try {
    let userInteraction = await UserInteraction.findOne({ user_id: userId, property_id: houseId });

    if (!userInteraction) {
      userInteraction = new UserInteraction({
        user_id: userId,
        property_id: houseId,
        time_spent: 0,
        favorited: false,
        skipped: false,
      });
      await userInteraction.save();
    }

    res.status(200).json(userInteraction); // Return the created or found interaction
  } catch (error) {
    console.error("Error logging user interaction:", error);
    res.status(500).json({ error: "Failed to log user interaction" });
  }
});

// GET route to check if a house is favorited
router.get('/:houseId/isFavorited', async (req, res) => {
  const { houseId } = req.params;
  const { userId } = req.query; // Note: using query parameters as in the original axios request

  try {
    // Check if there is an interaction for the given user and house
    const interaction = await UserInteraction.findOne({ user_id: userId, property_id: houseId });

    if (interaction) {
      // Send back the favorited status
      res.status(200).json({ favorited: interaction.favorited });
    } else {
      // If no interaction exists, default to not favorited
      res.status(200).json({ favorited: false });
    }
  } catch (error) {
    console.error("Error checking favorite status:", error);
    res.status(500).json({ error: 'Failed to check favorite status' });
  }
});

// Buy a house
router.post('/:houseId/buy', authMiddleware, async (req, res) => {
  try {
    const houseId = req.params.houseId;
    const buyerId = req.user.userId;

    // Find the house
    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ error: 'House not found' });
    }

    // Check if the house is still available
    if (!house.isAvailable) {
      return res.status(400).json({ error: 'House is no longer available' });
    }

    // Create a transaction
    const transaction = new Transaction({
      house: houseId,
      buyer: buyerId
    });
    await transaction.save();

    // Mark the house as unavailable
    house.isAvailable = false;
    await house.save();

    res.status(200).json({ message: 'House purchased successfully', transaction });
  } catch (error) {
    console.error("Error purchasing house:", error);
    res.status(500).json({ error: 'Failed to complete purchase' });
  }
});


// Location suggestions
router.get('/location-suggestions', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Query parameter is required' });

  try {
    const response = await axios.get(`https://photon.komoot.io/api/?q=${query}`);
    const locations = response.data.features
      .filter(feature => feature.properties.country === "India")
      .map(feature => ({
        label: feature.properties.name,
        value: `${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}`
      }));
    res.json(locations);
  } catch (error) {
    console.error("Error fetching location suggestions:", error.message);
    res.status(500).json({ error: 'Failed to fetch location suggestions' });
  }
});

// Current location by coordinates
router.get('/current-location', async (req, res) => {
  const { latitude, longitude } = req.query;
  if (!latitude || !longitude) return res.status(400).json({ error: 'Latitude and longitude are required' });

  try {
    const response = await axios.get(`https://photon.komoot.io/reverse?lat=${latitude}&lon=${longitude}`);
    const locationName = response.data.features[0]?.properties.name || "Unknown location";
    res.json({ locationName });
  } catch (error) {
    console.error("Error fetching location name:", error.message);
    res.status(500).json({ error: 'Failed to fetch location name' });
  }
});

// Get house details by ID
router.get('/:houseId', async (req, res) => {
  try {
    const houseId = req.params.houseId;
    const house = await House.findById(houseId).populate('seller', 'name');
    if (!house) {
      return res.status(404).json({ error: 'House not found' });
    }
    res.json(house);
  } catch (error) {
    console.error("Error fetching house details:", error);
    res.status(500).json({ error: 'Failed to fetch house details' });
  }
});

//---------------------------------------------------------------------------

// // Endpoint to get similar properties based on certain criteria
// router.get('/:houseId/similar', async (req, res) => {
//   try {
//     const houseId = req.params.houseId;
//     const house = await House.findById(houseId);

//     if (!house) {
//       return res.status(404).json({ error: 'House not found' });
//     }

//     // Define similarity criteria (price within 10%, same location, similar amenities)
//     const similarHouses = await House.find({
//       _id: { $ne: houseId }, // Exclude the current house
//       location: house.location,
//       price: { $gte: house.price * 0.9, $lte: house.price * 1.1 }, // Price within 10%
//       amenities: { $in: house.amenities }, // At least one matching amenity
//       isAvailable: true,
//     }).limit(5); // Limit to 5 similar properties

//     res.json(similarHouses);
//   } catch (error) {
//     console.error('Error fetching similar houses:', error);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// });


// Utility function to calculate similarity score
function calculateSimilarity(base, target) {
  // Customize based on attributes you want to compare
  const baseFeatures = [base.price, base.size, base.total_sqft, base.bath, base.balcony];
  const targetFeatures = [target.price, target.size, target.total_sqft, target.bath, target.balcony];
  
  // Calculate cosine similarity
  return cosineSimilarity(baseFeatures, targetFeatures);
}

// Fetch similar properties
async function findSimilarProperties(baseProperty, allProperties) {
  return allProperties
    .map((property) => ({
      property,
      similarityScore: calculateSimilarity(baseProperty, property)
    }))
    .filter((item) => item.similarityScore > 0.7) // Adjust threshold as needed
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .map((item) => item.property);
}

// Define the API route
router.get('/:houseId/similar', async (req, res) => {
  const { houseId } = req.params;
  
  try {
    const baseProperty = await House.findById(houseId);
    if (!baseProperty) return res.status(404).send("Base property not found");

    const allProperties = await House.find();
    const similarProperties = await findSimilarProperties(baseProperty, allProperties);

    res.json(similarProperties);
  } catch (error) {
    console.error("Error fetching similar houses:", error);
    res.status(500).send("Server error");
  }
});

//------------------------------------------------------------------------------------

// Endpoint to calculate predicted house price based on years and annual growth rate
router.post('/:houseId/priceInsight', async (req, res) => {
  const { houseId } = req.params;
  const { years } = req.body;

  try {
    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ success: false, message: 'House not found' });
    }

    // Fetch neighborhood data for the growth rate
    const neighborhoodData = await NeighborhoodData.findOne({ neighborhood: house.location });
    if (!neighborhoodData) {
      return res.status(404).json({ success: false, message: 'Neighborhood data not found' });
    }

    const annualGrowthRate = neighborhoodData.annualGrowthRate; // e.g., 0.05 for 5%

    // Calculate the predicted price after 'years' years
    const predictedPrice = house.price * Math.pow(1 + annualGrowthRate, years);

    return res.status(200).json({
      success: true,
      predictedPrice: predictedPrice.toFixed(2),  // Fixed to two decimal points
    });
  } catch (error) {
    console.error('Error calculating price insight:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

//---------------------------------------------------------------------------------




// Report a house
router.post('/:houseId/report', async (req, res) => {
  const { houseId } = req.params;
  const { userId, reason } = req.body;

  try {
    const house = await House.findById(houseId);
    if (!house) return res.status(404).json({ error: 'House not found' });

    const report = { user: userId, reason };
    house.reports.push(report);
    await house.save();

    res.status(201).json({ success: true, message: 'Report added successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to report the house.' });
  }
});

router.post('/:houseId/feedback', async (req, res) => {
  const { houseId } = req.params;
  const { userId, rating, comment } = req.body;

  console.log(houseId, userId, rating, comment);  // Debugging line

  try {
    const house = await House.findById(houseId);
    if (!house) return res.status(404).json({ error: 'House not found' });

    // Create new feedback object
    const feedback = { user: userId, rating, comment };

    // Add feedback to the house's feedbacks array
    house.feedbacks.push(feedback);

    // Update average rating
    const totalRatings = house.feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    house.averageRating = totalRatings / house.feedbacks.length;

    await house.save();

    res.status(201).json({ success: true, message: 'Feedback added successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add feedback.' });
  }
});



// Get feedback for a house
router.get('/:houseId/feedbacks', async (req, res) => {
  const { houseId } = req.params;

  try {
    const house = await House.findById(houseId);
    if (!house) return res.status(404).json({ error: 'House not found' });

    // Directly return the feedbacks embedded in the house document
    res.status(200).json(house.feedbacks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch feedback.' });
  }
});


module.exports = router;
