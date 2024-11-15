const express = require('express');
const { MongoClient } = require('mongodb');
// const pickle = require('pickle');
const cors = require('cors');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const { exec } = require('child_process');
const Property = require('./models/Property'); // Assuming you have a Property model
const pickle = require('node-pickle');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const uri = 'mongodb+srv://RaunakSharma:PozqDxDkbYn0rcLm@cluster0.zmhsk06.mongodb.net/';
const client = new MongoClient(uri);
let db;

// Connect to MongoDB
client.connect().then(() => {
    db = client.db('my_database');
    console.log("Connected to MongoDB");
}).catch((err) => console.error("MongoDB connection error:", err));

// Endpoint for data entry
app.post('/dataEntry', async (req, res) => {
    try {
        const newProperty = new Property(req.body);
        await newProperty.save();
        res.status(201).json({ message: 'Data saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving property data', error });
    }
});

// Endpoint to get unique locations
app.get('/locations', async (req, res) => {
    try {
        const data = await db.collection('metadata').findOne({ name: "locations" });
        // console.log(data);
        res.json(data ? data.data : []);
    } catch (error) {
        res.status(500).json({ error: "Error fetching locations" });
    }
});

app.post('/predict', async (req, res) => {
    const { location, sqft, bath, bhk } = req.body;

    try {
        // Fetch model and columns data
        const modelData = await db.collection('models').findOne({ name: "house_price_model" });
        const columnsData = await db.collection('metadata').findOne({ name: "columns" });

        // Ensure model and columns data are retrieved properly
        if (!modelData || !modelData.model || !columnsData || !columnsData.data) {
            throw new Error("Model or columns data not found");
        }

        // Load model and prepare data
        const model = await pickle.loads(modelData.model.buffer); // using node-pickle to load the model
        const columns = columnsData.data;
        const inputData = Array(columns.length).fill(0);

        if (columns.includes(`location_${location}`)) {
            inputData[columns.indexOf(`location_${location}`)] = 1;
        }

        inputData[columns.indexOf('total_sqft')] = sqft;
        inputData[columns.indexOf('bath')] = bath;
        inputData[columns.indexOf('bhk')] = bhk;

        console.log("Input data:", inputData);

        // Make prediction
        const prediction = model.predict([inputData])[0];
        res.json({ price: prediction });
    } catch (error) {
        console.error("Error in prediction:", error); // Log the full error
        res.status(500).json({ error: "Prediction failed" });
    }
});

// Endpoint to make a prediction
// app.post('/predict', async (req, res) => {
//     const { location, sqft, bath, bhk } = req.body;

//     try {
//         // Fetch model and columns data
//         const modelData = await db.collection('models').findOne({ name: "house_price_model" });
//         const columnsData = await db.collection('metadata').findOne({ name: "columns" });

//         // Load model and prepare data
//         const model = pickle.loads(modelData.model.buffer);
//         const columns = columnsData.data;
//         const inputData = Array(columns.length).fill(0);

//         if (columns.includes(`location_${location}`)) {
//             inputData[columns.indexOf(`location_${location}`)] = 1;
//         }

//         inputData[columns.indexOf('total_sqft')] = sqft;
//         inputData[columns.indexOf('bath')] = bath;
//         inputData[columns.indexOf('bhk')] = bhk;

//         console.log(inputData);

//         // Make prediction
//         const prediction = model.predict([inputData])[0];
//         res.json({ price: prediction });
//     } catch (error) {
//         console.error("Error in prediction:", error); // Log the full error
//         res.status(500).json({ error: "Prediction failed" });
//     }
// });


// Cron job to retrain model every Sunday at midnight
cron.schedule('0 0 * * SUN', async () => {
    try {
        const properties = await Property.find();

        // Check if there is enough data to retrain the model
        if (properties.length < 10) {
            console.log('Not enough data to retrain the model');
            return;
        }

        // Save property data to a JSON file
        const fs = require('fs');
        fs.writeFileSync('property_data.json', JSON.stringify(properties), 'utf8');

        // Execute train_model.py to retrain the model
        exec('python3 train_model.py', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error in retraining model: ${error.message}`);
                return;
            }
            console.log(`Model retrained successfully: ${stdout}`);
        });
    } catch (error) {
        console.error('Error fetching data for retraining:', error);
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
