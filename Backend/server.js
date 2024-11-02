const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors  = require("cors");
const cron = require('node-cron');
const {exec} = require('child_process');

const Property = require('./models/Property');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://RaunakSharma:PozqDxDkbYn0rcLm@cluster0.zmhsk06.mongodb.net/')
.then(()=>{ console.log("Mongodb connected")})
.catch((err) => console.log(err));

app.post('/dataEntry', async (req, res)=>{
    try{
        const newProperty = new Property(req.body);
        await newProperty.save();
        res.status(201).json({message: 'Data saved successfully'});
    }
    catch(error){
        res.status(500).json({message: 'Error saving Property Data', error});
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

app.post('/predict', (req, res) => {
    const { location, sqft, bath, bhk } = req.body;
    PythonShell.run('predict.py', { args: [location, sqft, bath, bhk] }, (err, results) => {
        if (err) return res.status(500).json({ message: 'Prediction failed', error: err.message });
        res.status(200).json({ predicted_price: parseFloat(results[0]) });
    });
});



cron.schedule('0 0 * * SUN', async ()=>{ //minute, hour, day, month, Sun
    try{
        const properties = await Property.find();
        if(properties.length < 10){
            console.log('Not enough data to retrain the model');
            return;
        }

        const fs = require('fs');
        fs.writeFileSync('property_data.json', JSON.stringify(properties), 'utf8');

        const {exec} = require('child_process');
        exec('python3 train_model.py', (error, stdout, stderr)=>{
            if(error){
                console.error(`Error in retraining model: ${error}`);
                return;
            }
            console.log(`Model retrained successfully: ${stdout}`);
        });
    }
    catch(error){
        console.error('Error fetching data for retraining:', error);
    }
});

const PORT = 5000;
app.listen(PORT, ()=>{
    console.log(`Server is runnning on http://localhost:${PORT}`);

})