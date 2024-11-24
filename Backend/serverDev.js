// const express = require('express');
// const connectDB = require('./Config/db');
// const authRoutes = require('./Routes/auth');
// const houseRoutes = require('./Routes/houses');
// const transactionRoutes = require('./Routes/transactions');
// const searchRoutes = require('./Routes/search');
// const chatRotes = require('./Routes/chat');
// const path = require('path');
// const cors = require('cors');
// require('dotenv').config();


// const app = express();
// const PORT = process.env.PORT || 5000;

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());
// // app.use(express.static(path.join(__dirname, "../Frontend/dist")))

// // Routes
// app.use('/auth', authRoutes);
// app.use('/houses', houseRoutes);
// app.use('/houses', searchRoutes);
// app.use('/transactions', transactionRoutes);
// app.use('/chats', chatRotes);

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//---------------------------------------------------------------------------------------

const express = require('express');
const { createServer } = require('http');
const connectDB = require('./Config/db');
const authRoutes = require('./Routes/auth');
const houseRoutes = require('./Routes/houses');
const transactionRoutes = require('./Routes/transactions');
const searchRoutes = require('./Routes/search');
const chatRoutes = require('./Routes/chat');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const socketHandler = require('./Socket/socket'); // Import the Socket.IO module

const app = express();
const PORT = process.env.PORT || 5000;

// Create an HTTP server instance to use with both Express and Socket.IO
const server = createServer(app);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/houses', houseRoutes);
app.use('/houses', searchRoutes);
app.use('/transactions', transactionRoutes);
app.use('/chats', chatRoutes);

// Integrate Socket.IO
socketHandler(server); // Pass the HTTP server to the Socket.IO module

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
