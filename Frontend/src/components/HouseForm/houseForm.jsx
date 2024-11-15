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

// import React, { useState } from 'react';
// import axios from 'axios';
// import { TextField, Button, Container, Typography } from '@mui/material';
// import Grid from '@mui/material/Grid2';

// const HouseForm = () => {
//   const [houseData, setHouseData] = useState({
//     title: '',
//     description: '',
//     area_type: '',
//     availability: '',
//     location: '',
//     size: '',
//     society: '',
//     total_sqft: '',
//     bath: '',
//     balcony: '',
//     price: ''
//   });
//   const [images, setImages] = useState([]);
//   const [video, setVideo] = useState(null);

//   const handleChange = (e) => {
//     setHouseData({ ...houseData, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e) => {
//     setImages([...e.target.files]);
//   };

//   const handleVideoChange = (e) => {
//     setVideo(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     Object.keys(houseData).forEach((key) => formData.append(key, houseData[key]));
//     images.forEach((image) => formData.append('images', image));
//     if (video) formData.append('video', video);

//     try {
//       await axios.post('http://localhost:5000/houses', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       alert('House listed successfully!');
//     } catch (error) {
//       console.error("Error listing house:", error);
//       alert('Failed to list house');
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Typography variant="h4" gutterBottom>List Your House</Typography>
//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={2}>
//           {['title', 'description', 'area_type', 'availability', 'location', 'size', 'society', 'total_sqft', 'bath', 'balcony', 'price'].map((field) => (
//             <Grid xs={12} key={field}>
//               <TextField
//                 fullWidth
//                 name={field}
//                 label={field.replace('_', ' ').toUpperCase()}
//                 variant="outlined"
//                 value={houseData[field]}
//                 onChange={handleChange}
//               />
//             </Grid>
//           ))}
//           <Grid xs={12}>
//             <Button variant="contained" component="label">
//               Upload Images
//               <input type="file" hidden multiple onChange={handleImageChange} />
//             </Button>
//           </Grid>
//           <Grid xs={12}>
//             <Button variant="contained" component="label">
//               Upload Video
//               <input type="file" hidden onChange={handleVideoChange} />
//             </Button>
//           </Grid>
//           <Grid xs={12}>
//             <Button type="submit" variant="contained" color="primary" fullWidth>Submit</Button>
//           </Grid>
//         </Grid>
//       </form>
//     </Container>
//   );
// };

// export default HouseForm;


//-------------------------------------------------------------




//-------------------------------------------------------------------

// import React, { useState } from 'react';
// import axios from 'axios';
// import { TextField, Button, Container, Typography, Autocomplete } from '@mui/material';
// import Grid from '@mui/material/Grid2';

// const HouseForm = () => {
//   const [houseData, setHouseData] = useState({
//     title: '',
//     description: '',
//     area_type: '',
//     availability: '',
//     location: '',
//     size: '',
//     society: '',
//     total_sqft: '',
//     bath: '',
//     balcony: '',
//     price: ''
//   });
//   const [images, setImages] = useState([]);
//   const [video, setVideo] = useState(null);
//   const [locationOptions, setLocationOptions] = useState([]);

//   const handleChange = (e) => {
//     setHouseData({ ...houseData, [e.target.name]: e.target.value });
//   };

//   // const handleLocationChange = async (e, value) => {
//   //   setHouseData({ ...houseData, location: value });
//   //   if (value.length > 2) {
//   //     try {
//   //       // const res = await axios.get(`https://photon.komoot.io/api/?q=${value}&osm_tag=country:IN`);
//   //       const res = await axios.get(`https://photon.komoot.io/api/?q=${value}`);
//   //       const locations = res.data.features.map(feature => ({
//   //         label: feature.properties.name,
//   //         value: `${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}`,
//   //         id: `${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}` // Unique ID using coordinates
//   //       }));
//   //       setLocationOptions(locations);
//   //     } catch (error) {
//   //       console.error("Error fetching location suggestions:", error);
//   //     }
//   //   }
//   // };

//   const handleLocationChange = async (e, value) => {
//     setHouseData({ ...houseData, location: value });
//     if (value.length > 2) {
//       try {
//         const res = await axios.get(`https://photon.komoot.io/api/?q=${value}`);
//         const locations = res.data.features
//           .filter(feature => feature.properties.country === "India") // Filter for Indian locations
//           .map(feature => ({
//             label: feature.properties.name,
//             value: `${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}`,
//             id: `${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}` // Unique ID using coordinates
//           }));
//         setLocationOptions(locations);
//       } catch (error) {
//         console.error("Error fetching location suggestions:", error);
//       }
//     }
//   };

//   const handleImageChange = (e) => {
//     setImages([...e.target.files]);
//   };

//   const handleVideoChange = (e) => {
//     setVideo(e.target.files[0]);
//   };

//   const setCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(async (position) => {
//         const { latitude, longitude } = position.coords;

//         try {
//           // Reverse geocoding using Photon to get place name
//           const res = await axios.get(`https://photon.komoot.io/reverse?lat=${latitude}&lon=${longitude}`);
//           const locationName = res.data.features[0]?.properties.name || "Unknown location";

//           // Update the location field with the place name
//           setHouseData((prevData) => ({ ...prevData, location: locationName }));
//           // console.log(locationName);
//         } catch (error) {
//           console.error("Error fetching location name:", error);
//           alert('Failed to fetch location name');
//         }
//       });
//     } else {
//       alert('Geolocation is not supported by this browser.');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     Object.keys(houseData).forEach((key) => formData.append(key, houseData[key]));
//     images.forEach((image) => formData.append('images', image));
//     if (video) formData.append('video', video);

//     try {
//       await axios.post('http://localhost:5000/houses', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       alert('House listed successfully!');
//     } catch (error) {
//       console.error("Error listing house:", error);
//       alert('Failed to list house');
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Typography variant="h4" gutterBottom>List Your House</Typography>
//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={2}>
//           {['title', 'description', 'area_type', 'availability', 'size', 'society', 'total_sqft', 'bath', 'balcony', 'price'].map((field) => (
//             <Grid xs={12} key={field}>
//               <TextField
//                 fullWidth
//                 name={field}
//                 label={field.replace('_', ' ').toUpperCase()}
//                 variant="outlined"
//                 value={houseData[field]}
//                 onChange={handleChange}
//               />
//             </Grid>
//           ))}
//           <Grid xs={12}>
//             <Autocomplete
//               freeSolo
//               options={locationOptions}
//               getOptionLabel={(option) => option.label}
//               isOptionEqualToValue={(option, value) => option.id === value.id} // Use `id` for equality
//               value={houseData.location ? { label: houseData.location } : null} // Bind the current location value
//               onInputChange={handleLocationChange}
//               onChange={(e, newValue) => {
//                 setHouseData((prevData) => ({
//                   ...prevData,
//                   location: newValue ? newValue.label : '', // Safely access label or fallback to empty
//                 }));
//               }}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Location"
//                   variant="outlined"
//                   fullWidth
//                 />
//               )}
//             />
//             <Button variant="contained" onClick={setCurrentLocation} style={{ marginTop: '10px' }}>
//               Use Current Location
//             </Button>
//           </Grid>
//           <Grid xs={12}>
//             <Button variant="contained" component="label">
//               Upload Images
//               <input type="file" hidden multiple onChange={handleImageChange} />
//             </Button>
//           </Grid>
//           <Grid xs={12}>
//             <Button variant="contained" component="label">
//               Upload Video
//               <input type="file" hidden onChange={handleVideoChange} />
//             </Button>
//           </Grid>
//           <Grid xs={12}>
//             <Button type="submit" variant="contained" color="primary" fullWidth>Submit</Button>
//           </Grid>
//         </Grid>
//       </form>
//     </Container>
//   );
// };

// export default HouseForm;

//---------------------------------------------------------------------

// import React, { useState } from 'react';
// import axios from 'axios';
// import { TextField, Button, Container, Typography, Autocomplete, MenuItem } from '@mui/material';
// import Grid from '@mui/material/Grid2';

// const HouseForm = () => {
//   const [houseData, setHouseData] = useState({
//     title: '',
//     description: '',
//     area_type: '',
//     availability: '',
//     location: '',
//     size: '',
//     society: '',
//     total_sqft: '',
//     bath: '',
//     balcony: '',
//     price: ''
//   });
//   const [images, setImages] = useState([]);
//   const [videos, setVideos] = useState([]);
//   const [locationOptions, setLocationOptions] = useState([]);

//   // Define area types directly in the frontend
//   const areaTypes = ['Urban', 'Suburban', 'Rural'];

//   const handleChange = (e) => {
//     setHouseData({ ...houseData, [e.target.name]: e.target.value });
//   };

//   const handleLocationChange = async (e, value) => {
//     setHouseData({ ...houseData, location: value });
//     if (value && value.length > 2) {
//       try {
//         const response = await axios.get(`http://localhost:5000/houses/location-suggestions`, {
//           params: { query: value }
//         });
//         setLocationOptions(response.data);
//       } catch (error) {
//         console.error("Error fetching location suggestions:", error);
//       }
//     }
//   };

//   const setCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(async (position) => {
//         const { latitude, longitude } = position.coords;
//         try {
//           const response = await axios.get(`http://localhost:5000/houses/current-location`, {
//             params: { latitude, longitude }
//           });
//           const locationName = response.data.locationName;
//           setHouseData((prevData) => ({ ...prevData, location: locationName }));
//         } catch (error) {
//           console.error("Error fetching location name:", error);
//           alert('Failed to fetch location name');
//         }
//       });
//     } else {
//       alert('Geolocation is not supported by this browser.');
//     }
//   };

//   const handleImageChange = (e) => {
//     setImages([...e.target.files]);
//   };

//   const handleVideoChange = (e) => {
//     setVideos([...e.target.files]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     Object.keys(houseData).forEach((key) => formData.append(key, houseData[key]));
//     images.forEach((image) => formData.append('images', image));
//     videos.forEach((video) => formData.append('videos', video));

//     try {
//       await axios.post('http://localhost:5000/houses', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       alert('House listed successfully!');
//     } catch (error) {
//       console.error("Error listing house:", error);
//       alert('Failed to list house');
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Typography variant="h4" gutterBottom>List Your House</Typography>
//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={2}>
//           {['title', 'description', 'availability', 'size', 'society', 'total_sqft', 'bath', 'balcony', 'price'].map((field) => (
//             <Grid xs={12} key={field}>
//               <TextField
//                 fullWidth
//                 name={field}
//                 label={field.replace('_', ' ').toUpperCase()}
//                 variant="outlined"
//                 value={houseData[field]}
//                 onChange={handleChange}
//               />
//             </Grid>
//           ))}
//           <Grid xs={12}>
//             <TextField
//               select
//               fullWidth
//               name="area_type"
//               label="Area Type"
//               variant="outlined"
//               value={houseData.area_type}
//               onChange={handleChange}
//             >
//               {areaTypes.map((type) => (
//                 <MenuItem key={type} value={type}>
//                   {type}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Grid>
//           <Grid xs={12}>
//             <Autocomplete
//               options={locationOptions}
//               getOptionLabel={(option) => option.label || ''}
//               renderInput={(params) => (
//                 <TextField {...params} label="Location" variant="outlined" />
//               )}
//               value={houseData.location ? { label: houseData.location } : null}
//               onInputChange={(event, newValue) => handleLocationChange(event, newValue)}
//               onChange={(event, value) => setHouseData({ ...houseData, location: value?.label || '' })}
//             />
//           </Grid>
//           <Grid xs={12}>
//             <Button variant="contained" onClick={setCurrentLocation}>Use Current Location</Button>
//           </Grid>
//           <Grid xs={12}>
//             <Button variant="contained" component="label">
//               Upload Images
//               <input type="file" hidden multiple onChange={handleImageChange} />
//             </Button>
//             <Button variant="contained" component="label">
//               Upload Videos
//               <input type="file" hidden multiple onChange={handleVideoChange} />
//             </Button>
//           </Grid>
//           <Grid xs={12}>
//             <Button type="submit" variant="contained" color="primary">Submit</Button>
//           </Grid>
//         </Grid>
//       </form>
//     </Container>
//   );
// };

// export default HouseForm;


//-----------------------------------------------------------------------------------------


import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Autocomplete, MenuItem, FormControl, InputLabel, Select, Chip, OutlinedInput } from '@mui/material';
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
    price: '',
    amenities: [] // Added amenities field
  });
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);

  const areaTypes = ['Urban', 'Suburban', 'Rural'];
  const amenitiesList = ['Swimming Pool', 'Garden', 'Gym', 'Parking', 'Security', 'Playground', 'Clubhouse'];

  const handleChange = (e) => {
    setHouseData({ ...houseData, [e.target.name]: e.target.value });
  };

  const handleAmenitiesChange = (event) => {
    const { value } = event.target;
    setHouseData({ ...houseData, amenities: typeof value === 'string' ? value.split(',') : value });
  };

  const handleLocationChange = async (e, value) => {
    setHouseData({ ...houseData, location: value });
    if (value && value.length > 2) {
      try {
        const response = await axios.get(`http://localhost:5000/houses/location-suggestions`, {
          params: { query: value }
        });
        setLocationOptions(response.data);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    }
  };

  const setCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(`http://localhost:5000/houses/current-location`, {
            params: { latitude, longitude }
          });
          const locationName = response.data.locationName;
          setHouseData((prevData) => ({ ...prevData, location: locationName }));
        } catch (error) {
          console.error("Error fetching location name:", error);
          alert('Failed to fetch location name');
        }
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleVideoChange = (e) => {
    setVideos([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(houseData).forEach((key) => formData.append(key, houseData[key]));
    images.forEach((image) => formData.append('images', image));
    videos.forEach((video) => formData.append('videos', video));

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
          {['title', 'description', 'availability', 'size', 'society', 'total_sqft', 'bath', 'balcony', 'price'].map((field) => (
            <Grid xs={12} key={field}>
              <TextField
                fullWidth
                name={field}
                label={field.replace('_', ' ').toUpperCase()}
                value={houseData[field]}
                onChange={handleChange}
                required
              />
            </Grid>
          ))}

          <Grid xs={12}>
            <Autocomplete
              options={locationOptions}
              getOptionLabel={(option) => option.label || ''}
              renderInput={(params) => (
                <TextField {...params} label="Location" variant="outlined" />
              )}
              value={houseData.location ? { label: houseData.location } : null}
              onInputChange={(event, newValue) => handleLocationChange(event, newValue)}
              onChange={(event, value) => setHouseData({ ...houseData, location: value?.label || '' })}
            />
          </Grid>

          <Grid xs={12}>
            <FormControl fullWidth>
              <InputLabel>Area Type</InputLabel>
              <Select
                name="area_type"
                value={houseData.area_type}
                onChange={handleChange}
                required
              >
                {areaTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid xs={12}>
            <FormControl fullWidth>
              <InputLabel>Amenities</InputLabel>
              <Select
                multiple
                value={houseData.amenities}
                onChange={handleAmenitiesChange}
                input={<OutlinedInput label="Amenities" />}
                renderValue={(selected) => (
                  <div>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </div>
                )}
              >
                {amenitiesList.map((amenity) => (
                  <MenuItem key={amenity} value={amenity}>
                    {amenity}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid xs={12}>
            <Button variant="contained" onClick={setCurrentLocation}>Use Current Location</Button>
          </Grid>

          <Grid xs={12}>
            <Button variant="contained" component="label">
              Upload Images
              <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
            </Button>
          </Grid>

          <Grid xs={12}>
            <Button variant="contained" component="label">
              Upload Videos
              <input type="file" hidden multiple accept="video/*" onChange={handleVideoChange} />
            </Button>
          </Grid>

          <Grid xs={12}>
            <Button type="submit" variant="contained" color="primary">Submit</Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default HouseForm;






