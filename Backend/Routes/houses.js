const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const House = require('../models/House');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../Middleware/authMiddleware');
require('dotenv').config();

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

// Create a new house listing with images and video
router.post('/', upload.fields([{ name: 'images' }, { name: 'video' }]), async (req, res) => {
  try {
    const { title, description, area_type, availability, location, size, society, total_sqft, bath, balcony, price } = req.body;
    const images = req.files['images'] ? req.files['images'].map(file => file.path) : [];
    const video = req.files['video'] ? req.files['video'][0].path : null;

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
      video,
      // seller: req.user.id
    });

    await house.save();
    res.status(201).json(house);
  } catch (error) {
    console.error("Error creating house listing:", error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// Get all houses
// router.get('/', async (req, res) => {
//   try {
//     const houses = await House.find().populate('seller', 'name');
//     res.json(houses);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch houses' });
//   }
// });

// Get all houses
router.get('/', async (req, res) => {
  try {
    const houses = await House.find().populate('seller', 'name');
    res.json(houses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch houses' });
  }
});

// Buy a house
router.post('/:houseId/buy', authMiddleware, async (req, res) => {
  try {
    const houseId = req.params.houseId;
    const buyerId = req.user.id;

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

module.exports = router;
