const express = require('express');
const House = require('../models/House');
const authMiddleware = require('../Middleware/authMiddleware');

const router = express.Router();

// Get houses bought by the user
router.get('/my-purchases', authMiddleware, async (req, res) => {
  const purchasedHouses = await House.find({ buyer: req.user.userId, isAvailable: false });
  res.json(purchasedHouses);
});

module.exports = router;
