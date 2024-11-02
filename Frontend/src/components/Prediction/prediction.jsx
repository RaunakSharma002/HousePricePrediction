import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    CircularProgress,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';

function PricePrediction() {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [sqft, setSqft] = useState("");
    const [bath, setBath] = useState("");
    const [bhk, setBhk] = useState("");
    const [price, setPrice] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch locations on mount
    useEffect(() => {
        axios.get('http://localhost:5000/locations')
            .then((response) => {
                setLocations(response.data);
            })
            .catch((error) => console.error("Error fetching locations:", error));
    }, []);

    const handlePredict = () => {
        setLoading(true);
        axios.post('http://localhost:5000/predict', {
            location: selectedLocation,
            sqft: parseFloat(sqft),
            bath: parseInt(bath),
            bhk: parseInt(bhk),
        })
        .then((response) => {
            setPrice(response.data.price);
            setLoading(false);
        })
        .catch((error) => {
            console.error("Prediction error:", error);
            setLoading(false);
        });
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom>
                Real Estate Price Prediction
            </Typography>
            <Select
                fullWidth
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                displayEmpty
                sx={{ mb: 2 }}
            >
                <MenuItem value="">
                    <em>Select Location</em>
                </MenuItem>
                {locations.map((location) => (
                    <MenuItem key={location} value={location}>
                        {location}
                    </MenuItem>
                ))}
            </Select>
            <TextField
                fullWidth
                label="Total Sqft"
                type="number"
                value={sqft}
                onChange={(e) => setSqft(e.target.value)}
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Bath"
                type="number"
                value={bath}
                onChange={(e) => setBath(e.target.value)}
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="BHK"
                type="number"
                value={bhk}
                onChange={(e) => setBhk(e.target.value)}
                sx={{ mb: 2 }}
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handlePredict}
                disabled={loading}
                sx={{ mb: 2 }}
            >
                {loading ? <CircularProgress size={24} /> : "Predict Price"}
            </Button>
            {price !== null && (
                <Typography variant="h6">
                    Estimated Price: ₹{price.toFixed(2)}
                </Typography>
            )}
        </Box>
    );
}

export default PricePrediction;
