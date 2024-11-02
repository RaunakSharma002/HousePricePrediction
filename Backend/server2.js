const express = require('express');
const mongoose = require('mongoose');
const { Binary } = require('mongodb');
const pickle = require('picklejs');
const bodyParser = require('body-parser');

// Initialize Express app and configure middleware
const app = express();
app.use(bodyParser.json());

// MongoDB connection
const uri = "mongodb+srv://RaunakSharma:PozqDxDkbYn0rcLm@cluster0.zmhsk06.mongodb.net/";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Load model and columns data from MongoDB on server start
let model, columns;
db.once('open', async () => {
    const modelData = await db.collection('models').findOne({ name: 'house_price_model' });
    const columnsData = await db.collection('metadata').findOne({ name: 'columns' });
    if (modelData && columnsData) {
        model = pickle.loads(modelData.model.buffer); // Deserialize the model
        columns = columnsData.data; // Load the column names
        console.log("Model and columns loaded from MongoDB.");
    } else {
        console.error("Error loading model or columns from MongoDB.");
    }
});

app.get('/locations', async (req, res) => {
    try {
        const data = await db.collection('metadata').findOne({ name: "locations" });
        // console.log(data);
        res.json(data ? data.data : []);
    } catch (error) {
        res.status(500).json({ error: "Error fetching locations" });
    }
});

// Define predict endpoint
app.post('/predict', async (req, res) => {
    try {
        const { location, sqft, bath, bhk } = req.body;

        // Prepare input data with zero values for one-hot encoded locations
        const input = Array(columns.length).fill(0);
        input[columns.indexOf('total_sqft')] = parseFloat(sqft);
        input[columns.indexOf('bath')] = parseInt(bath);
        input[columns.indexOf('bhk')] = parseInt(bhk);

        // Set location one-hot encoding if it exists in columns
        const locationIndex = columns.indexOf(`location_${location}`);
        if (locationIndex !== -1) {
            input[locationIndex] = 1;
        }

        // Convert input to a 2D array for prediction
        const prediction = model.predict([input]);

        // Send back the predicted price
        res.json({ price: prediction[0] });
    } catch (error) {
        console.error("Error during prediction:", error);
        res.status(500).json({ error: "Prediction failed" });
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
