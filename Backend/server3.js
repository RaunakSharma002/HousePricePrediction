const express = require('express');
const { exec } = require('child_process');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const uri = 'mongodb+srv://RaunakSharma:PozqDxDkbYn0rcLm@cluster0.zmhsk06.mongodb.net/';
const client = new MongoClient(uri);
let db;

client.connect().then(() => {
    db = client.db('my_database');
    console.log("Connected to MongoDB");
}).catch((err) => console.error("MongoDB connection error:", err));

app.get('/locations', async (req, res) => {
    try {
        const data = await db.collection('metadata').findOne({ name: "locations" });
        // console.log(data);
        res.json(data ? data.data : []);
    } catch (error) {
        res.status(500).json({ error: "Error fetching locations" });
    }
});

// Endpoint to make a prediction
app.post('/predict', (req, res) => {
    const { location, sqft, bath, bhk } = req.body;

    // Call the predict.py script
    exec(`python predict3.py "${location}" ${sqft} ${bath} ${bhk}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error.message}`);
            res.status(500).json({ error: "Prediction failed" });
            return;
        }
        if (stderr) {
            console.error(`Script stderr: ${stderr}`);
        }

        try {
            const prediction = JSON.parse(stdout);
            res.json(prediction);
        } catch (parseError) {
            console.error("Error parsing prediction result:", parseError);
            res.status(500).json({ error: "Prediction parsing failed" });
        }
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
