// import React, { useEffect, useState } from 'react';
// import api from '../api';
// import { Card, CardContent, Typography, Grid, Button } from '@mui/material';

// const HouseList = ({ token }) => {
//   const [houses, setHouses] = useState([]);

//   useEffect(() => {
//     const fetchHouses = async () => {
//       const response = await api.get('/houses');
//       setHouses(response.data);
//     };
//     fetchHouses();
//   }, []);

//   const handleBuy = async (houseId) => {
//     try {
//       await api.put(`/houses/${houseId}/buy`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert("House bought successfully!");
//     } catch (error) {
//       console.error("Purchase failed:", error);
//     }
//   };

//   return (
//     <Grid container spacing={4}>
//       {houses.map((house) => (
//         <Grid item xs={12} sm={6} md={4} key={house._id}>
//           <Card>
//             <CardContent>
//               <Typography variant="h5">{house.title}</Typography>
//               <Typography>{house.description}</Typography>
//               <Typography>Price: ₹{house.price}</Typography>
//               <Typography>Location: {house.location}</Typography>
//               <Button onClick={() => handleBuy(house._id)} variant="contained" color="primary">
//                 Buy
//               </Button>
//             </CardContent>
//           </Card>
//         </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default HouseList;


//-------------------------------------------------

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Card, CardContent, Typography, Button, CardMedia, Container } from '@mui/material';
// import Grid from '@mui/material/Grid2';

// const HouseList = () => {
//   const [houses, setHouses] = useState([]);

//   useEffect(() => {
//     const fetchHouses = async () => {
//       try {
//         const res = await axios.get('http://localhost:5000/houses');
//         setHouses(res.data);
//       } catch (error) {
//         console.error("Error fetching houses:", error);
//       }
//     };
//     fetchHouses();
//   }, []);

//   const handleBuy = async (houseId) => {
//     try {
//       await axios.post(`http://localhost:5000/houses/${houseId}/buy`, {}, {});
//       alert('House purchased successfully!');
//       setHouses(houses.map(house => 
//         house._id === houseId ? { ...house, isAvailable: false } : house
//       ));
//     } catch (error) {
//       console.error("Error purchasing house:", error);
//       alert('Failed to purchase house');
//     }
//   };

//   return (
//     <Container>
//       <Typography variant="h4" gutterBottom>Available Houses</Typography>
//       <Grid container spacing={4}>
//         {houses.map((house) => (
//           <Grid xs={12} sm={6} md={4} key={house._id}>
//             <Card>
//               {house.images && house.images.length > 0 && (
//                 <CardMedia
//                   component="img"
//                   height="200"
//                   image={house.images[0]}
//                   alt={house.title}
//                 />
//               )}
//               <CardContent>
//                 <Typography variant="h5">{house.title}</Typography>
//                 <Typography>Location: {house.location}</Typography>
//                 <Typography>Area Type: {house.area_type}</Typography>
//                 <Typography>Size: {house.size}</Typography>
//                 <Typography>Price: ₹{house.price}</Typography>
//                 {/* <Typography variant="h5">House Title</Typography>
//                 <Typography>Location: banglore</Typography>
//                 <Typography>Area Type: Medium</Typography>
//                 <Typography>Size: 52 yare</Typography>
//                 <Typography>Price: ₹ 100000</Typography>
//                 <Button
//                     variant="contained"
//                     color="primary"
//                 >Buy</Button> */}

//                 {house.isAvailable ? (
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() => handleBuy(house._id)}
//                   >
//                     Buy
//                   </Button>
//                 ) : (
//                   <Typography color="error">Sold</Typography>
//                 )}
//               </CardContent>
//             </Card>
//           </Grid>
//           ))}
//       </Grid>
//     </Container>
//   );
// };

// export default HouseList;


//--------------------------------------------------------------
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Card, CardContent, Typography, Button, CardMedia, Container, TextField, Select, MenuItem } from '@mui/material';
// import Grid from '@mui/material/Grid2';

// const HouseList = () => {
//   const [houses, setHouses] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [areaType, setAreaType] = useState('');
//   const [minPrice, setMinPrice] = useState('');
//   const [maxPrice, setMaxPrice] = useState('');

//   useEffect(() => {
//     fetchHouses();
//   }, [searchTerm, areaType, minPrice, maxPrice]);

//   const fetchHouses = async () => {
//     try {
//       const queryParams = new URLSearchParams({
//         search: searchTerm,
//         area_type: areaType,
//         minPrice,
//         maxPrice
//       }).toString();

//       const res = await axios.get(`http://localhost:5000/houses?${queryParams}`);
//       setHouses(res.data);
//     } catch (error) {
//       console.error("Error fetching houses:", error);
//     }
//   };

//   const handleBuy = async (houseId) => {
//     try {
//       await axios.post(`http://localhost:5000/houses/${houseId}/buy`, {}, {});
//       alert('House purchased successfully!');
//       setHouses(houses.map(house => 
//         house._id === houseId ? { ...house, isAvailable: false } : house
//       ));
//     } catch (error) {
//       console.error("Error purchasing house:", error);
//       alert('Failed to purchase house');
//     }
//   };

//   return (
//     <Container>
//       <Typography variant="h4" gutterBottom>Available Houses</Typography>

//       {/* Search and Filter Controls */}
//       <div style={{ marginBottom: '20px' }}>
//         <TextField
//           label="Search by title or location"
//           variant="outlined"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{ marginRight: '10px' }}
//         />
//         <Select
//           value={areaType}
//           onChange={(e) => setAreaType(e.target.value)}
//           displayEmpty
//           style={{ marginRight: '10px' }}
//         >
//           <MenuItem value="">All Area Types</MenuItem>
//           <MenuItem value="Urban">Urban</MenuItem>
//           <MenuItem value="Suburban">Suburban</MenuItem>
//           <MenuItem value="Rural">Rural</MenuItem>
//         </Select>
//         <TextField
//           label="Min Price"
//           variant="outlined"
//           type="number"
//           value={minPrice}
//           onChange={(e) => setMinPrice(e.target.value)}
//           style={{ marginRight: '10px' }}
//         />
//         <TextField
//           label="Max Price"
//           variant="outlined"
//           type="number"
//           value={maxPrice}
//           onChange={(e) => setMaxPrice(e.target.value)}
//         />
//         <Button variant="contained" color="primary" onClick={fetchHouses} style={{ marginLeft: '10px' }}>
//           Apply Filters
//         </Button>
//       </div>

//       {/* House Listing */}
//       <Grid container spacing={4}>
//         {houses.map((house) => (
//           <Grid xs={12} sm={6} md={4} key={house._id}>
//             <Card>
//               {house.images && house.images.length > 0 && (
//                 <CardMedia
//                   component="img"
//                   height="200"
//                   image={house.images[0]}
//                   alt={house.title}
//                 />
//               )}
//               <CardContent>
//                 <Typography variant="h5">{house.title}</Typography>
//                 <Typography>Location: {house.location}</Typography>
//                 <Typography>Area Type: {house.area_type}</Typography>
//                 <Typography>Size: {house.size}</Typography>
//                 <Typography>Price: ₹{house.price}</Typography>
//                 {house.isAvailable ? (
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() => handleBuy(house._id)}
//                   >
//                     Buy
//                   </Button>
//                 ) : (
//                   <Typography color="error">Sold</Typography>
//                 )}
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// };

// export default HouseList;

//----------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button, CardMedia, Container, TextField, Select, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom'; // Using useNavigate instead of useHistory

const HouseList = () => {
  const [houses, setHouses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [areaType, setAreaType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const navigate = useNavigate(); // Using useNavigate

  useEffect(() => {
    fetchHouses();
  }, [searchTerm, areaType, minPrice, maxPrice]);

  const fetchHouses = async () => {
    try {
      const queryParams = new URLSearchParams({
        search: searchTerm,
        area_type: areaType,
        minPrice,
        maxPrice
      }).toString();

      const res = await axios.get(`http://localhost:5000/houses?${queryParams}`);
      setHouses(res.data);
    } catch (error) {
      console.error("Error fetching houses:", error);
    }
  };

  const handleBuy = async (houseId) => {
    try {
      await axios.post(`http://localhost:5000/houses/${houseId}/buy`, {}, {});
      alert('House purchased successfully!');
      setHouses(houses.map(house => 
        house._id === houseId ? { ...house, isAvailable: false } : house
      ));
    } catch (error) {
      console.error("Error purchasing house:", error);
      alert('Failed to purchase house');
    }
  };

  const handleShowDetails = (houseId) => {
    navigate(`/house/${houseId}`); // Navigate to house detail page using useNavigate
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Available Houses</Typography>

      {/* Search and Filter Controls */}
      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Search by title or location"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <Select
          value={areaType}
          onChange={(e) => setAreaType(e.target.value)}
          displayEmpty
          style={{ marginRight: '10px' }}
        >
          <MenuItem value="">All Area Types</MenuItem>
          <MenuItem value="Urban">Urban</MenuItem>
          <MenuItem value="Suburban">Suburban</MenuItem>
          <MenuItem value="Rural">Rural</MenuItem>
        </Select>
        <TextField
          label="Min Price"
          variant="outlined"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Max Price"
          variant="outlined"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={fetchHouses} style={{ marginLeft: '10px' }}>
          Apply Filters
        </Button>
      </div>

      {/* House Listing */}
      <Grid container spacing={4}>
        {houses.map((house) => (
          <Grid xs={12} sm={6} md={4} key={house._id}>
            <Card>
              {house.images && house.images.length > 0 && (
                <CardMedia
                  component="img"
                  height="200"
                  image={house.images[0]}
                  alt={house.title}
                />
              )}
              <CardContent>
                <Typography variant="h5">{house.title}</Typography>
                <Typography>Location: {house.location}</Typography>
                <Typography>Area Type: {house.area_type}</Typography>
                <Typography>Size: {house.size}</Typography>
                <Typography>Price: ₹{house.price}</Typography>
                {house.isAvailable ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleBuy(house._id)}
                  >
                    Buy
                  </Button>
                ) : (
                  <Typography color="error">Sold</Typography>
                )}
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleShowDetails(house._id)}
                  style={{ marginTop: '10px' }}
                >
                  Show Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HouseList;



