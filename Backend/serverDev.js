const express = require('express');
const connectDB = require('./Config/db');
const authRoutes = require('./Routes/auth');
const houseRoutes = require('./Routes/houses');
// const transactionRoutes = require('./Routes/transactions');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/houses', houseRoutes);
// app.use('/api/transactions', transactionRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
