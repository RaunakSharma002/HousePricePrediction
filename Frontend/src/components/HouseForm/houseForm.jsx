// import React, { useState } from 'react';
// import { TextField, Button } from '@mui/material';
// import api from '../api';

// const HouseForm = ({ token }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [location, setLocation] = useState('');
//   const [price, setPrice] = useState('');

//   const handleAddHouse = async () => {
//     try {
//       await api.post(
//         '/houses',
//         { title, description, location, price },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert("House added successfully!");
//     } catch (error) {
//       console.error("Failed to add house:", error);
//     }
//   };

//   return (
//     <div>
//       <TextField label="Title" onChange={(e) => setTitle(e.target.value)} />
//       <TextField label="Description" onChange={(e) => setDescription(e.target.value)} />
//       <TextField label="Location" onChange={(e) => setLocation(e.target.value)} />
//       <TextField label="Price" type="number" onChange={(e) => setPrice(e.target.value)} />
//       <Button onClick={handleAddHouse}>Add House</Button>
//     </div>
//   );
// };

// export default HouseForm;




///------------------------------------------------------------------

import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

const HouseForm = () => {
  const [houseData, setHouseData] = useState({
    title: '',
    description: '',
    area_type: '',
    availability: '',
    location: '',
    size: '',
    society: '',
    total_sqft: '',
    bath: '',
    balcony: '',
    price: ''
  });
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);

  const handleChange = (e) => {
    setHouseData({ ...houseData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(houseData).forEach((key) => formData.append(key, houseData[key]));
    images.forEach((image) => formData.append('images', image));
    if (video) formData.append('video', video);

    try {
      await axios.post('http://localhost:5000/houses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('House listed successfully!');
    } catch (error) {
      console.error("Error listing house:", error);
      alert('Failed to list house');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>List Your House</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {['title', 'description', 'area_type', 'availability', 'location', 'size', 'society', 'total_sqft', 'bath', 'balcony', 'price'].map((field) => (
            <Grid xs={12} key={field}>
              <TextField
                fullWidth
                name={field}
                label={field.replace('_', ' ').toUpperCase()}
                variant="outlined"
                value={houseData[field]}
                onChange={handleChange}
              />
            </Grid>
          ))}
          <Grid xs={12}>
            <Button variant="contained" component="label">
              Upload Images
              <input type="file" hidden multiple onChange={handleImageChange} />
            </Button>
          </Grid>
          <Grid xs={12}>
            <Button variant="contained" component="label">
              Upload Video
              <input type="file" hidden onChange={handleVideoChange} />
            </Button>
          </Grid>
          <Grid xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>Submit</Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default HouseForm;
