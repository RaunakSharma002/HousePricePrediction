// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Container, Typography, Button, CardMedia, Card, CardContent } from '@mui/material';
// import Grid from '@mui/material/Grid2';
// import { useParams } from 'react-router-dom';

// const HouseDetail = () => {
//   const { houseId } = useParams();
//   const [house, setHouse] = useState(null);

//   useEffect(() => {
//     const fetchHouseDetail = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/houses/${houseId}`);
//         setHouse(res.data);
//       } catch (error) {
//         console.error("Error fetching house details:", error);
//       }
//     };
//     fetchHouseDetail();
//   }, [houseId]);

//   if (!house) {
//     return <Typography>Loading...</Typography>;
//   }

//   return (
//     <Container>
//       <Typography variant="h4" gutterBottom>{house.title}</Typography>

//       <Grid container spacing={4}>
//         <Grid xs={12} md={6}>
//           {house.images && house.images.length > 0 && (
//             <CardMedia
//               component="img"
//               height="400"
//               image={house.images[0]}
//               alt={house.title}
//             />
//           )}
//         </Grid>
//         <Grid xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6">Description</Typography>
//               <Typography>{house.description}</Typography>

//               <Typography variant="h6">Location</Typography>
//               <Typography>{house.location}</Typography>

//               <Typography variant="h6">Price</Typography>
//               <Typography>₹{house.price}</Typography>

//               <Typography variant="h6">Area Type</Typography>
//               <Typography>{house.area_type}</Typography>

//               <Typography variant="h6">Size</Typography>
//               <Typography>{house.size}</Typography>

//               <Typography variant="h6">Bathrooms</Typography>
//               <Typography>{house.bath}</Typography>

//               <Typography variant="h6">Balconies</Typography>
//               <Typography>{house.balcony}</Typography>

//               <Typography variant="h6">Total Square Feet</Typography>
//               <Typography>{house.total_sqft}</Typography>

//               {house.videos && house.videos.length > 0 && (
//                 <div style={{ marginTop: '20px' }}>
//                   <Typography variant="h6">Video</Typography>
//                   <video width="100%" controls>
//                     <source src={house.videos[0]} type="video/mp4" />
//                     Your browser does not support the video tag.
//                   </video>
//                 </div>
//               )}
//               {house.isAvailable ? (
//                 <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>
//                   Buy
//                 </Button>
//               ) : (
//                 <Typography color="error">Sold</Typography>
//               )}
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default HouseDetail;

//------------------------------------------------------------------------------

// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import { Container, Typography, Button, CardMedia, Card, CardContent } from '@mui/material';
// import Grid from '@mui/material/Grid2';
// import { useParams } from 'react-router-dom';

// const HouseDetail = () => {
//   const { houseId } = useParams();
//   const [house, setHouse] = useState(null);
//   const [timeSpent, setTimeSpent] = useState(0);
//   const [isFavorited, setIsFavorited] = useState(false);
//   const timeSpentRef = useRef(0); // Use a ref to keep track of timeSpent

//   const userId = localStorage.getItem('userId');

//   useEffect(() => {
//     let intervalId;
//     const startTime = Date.now();

//     // Fetch house details and log user interaction
//     const fetchHouseDetail = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/houses/${houseId}`);
//         setHouse(res.data);

//         // Fetch initial favorite status
//         if (userId) {
//           const favoriteRes = await axios.get(`http://localhost:5000/houses/${houseId}/isFavorited`, { params: { userId } });
//           setIsFavorited(favoriteRes.data.isFavorited);

//           // Log the interaction in the backend
//           await axios.post(`http://localhost:5000/houses/${houseId}/interaction`, { userId });
//         }
//       } catch (error) {
//         console.error("Error fetching house details:", error);
//       }
//     };

//     fetchHouseDetail();

//     // Start tracking time spent
//     intervalId = setInterval(() => {
//       const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
//       setTimeSpent(elapsedSeconds);
//       timeSpentRef.current = elapsedSeconds; // Update ref with the current time
//     }, 1000);

//     // Cleanup on component unmount
//     return () => {
//       clearInterval(intervalId);
//       if (userId && houseId) {
//         updateTimeSpent(); // Update time spent when user leaves page
//       }
//     };
//   }, [houseId, userId]);

//   // Update time spent in the database
//   const updateTimeSpent = async () => {
//     if (!userId || !houseId) return; // Prevent unnecessary API call if userId or houseId is missing

//     try {
//       console.log('Time spent (from ref):', timeSpentRef.current);
//       await axios.post(`http://localhost:5000/houses/${houseId}/updateTimeSpent`, { userId, timeSpent: timeSpentRef.current });
//     } catch (error) {
//       console.error("Error updating time spent:", error);
//     }
//   };

//   // Handle favoriting
//   const handleFavoriting = async () => {
//     try {
//       const response = await axios.post(`http://localhost:5000/houses/${houseId}/favorite`, { userId });
//       const updatedFavoriteStatus = response.data.favorited;
//       setIsFavorited(updatedFavoriteStatus);
//     } catch (error) {
//       console.error("Error favoriting house:", error);
//     }
//   };

//   if (!house) {
//     return <Typography>Loading...</Typography>;
//   }

//   return (
//     <Container>
//       <Typography variant="h4" gutterBottom>{house.title}</Typography>

//       <Grid container spacing={4}>
//         <Grid xs={12} md={6}>
//           {house.images && house.images.length > 0 && house.images.map((image, index) => (
//             <CardMedia
//               key={index}
//               component="img"
//               height="200"
//               image={image}
//               alt={`${house.title} image ${index + 1}`}
//               style={{ marginBottom: '10px' }}
//             />
//           ))}
//         </Grid>

//         <Grid>            
//           {house.videos && house.videos.length > 0 && (
//             <div style={{ marginTop: '20px' }}>
//               <Typography variant="h6">Videos</Typography>
//               {house.videos.map((video, index) => (
//                 <video key={index} width="100%" controls style={{ marginBottom: '10px' }}>
//                   <source src={video} type="video/mp4" />
//                   Your browser does not support the video tag.
//                 </video>
//               ))}
//             </div>
//           )}
//         </Grid>

//         <Grid xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6">Description</Typography>
//               <Typography>{house.description}</Typography>

//               <Typography variant="h6">Location</Typography>
//               <Typography>{house.location}</Typography>

//               <Typography variant="h6">Price</Typography>
//               <Typography>₹{house.price}</Typography>

//               <Typography variant="h6">Area Type</Typography>
//               <Typography>{house.area_type}</Typography>

//               <Typography variant="h6">Size</Typography>
//               <Typography>{house.size}</Typography>

//               <Typography variant="h6">Bathrooms</Typography>
//               <Typography>{house.bath}</Typography>

//               <Typography variant="h6">Balconies</Typography>
//               <Typography>{house.balcony}</Typography>

//               <Typography variant="h6">Total Square Feet</Typography>
//               <Typography>{house.total_sqft}</Typography>

//               {house.isAvailable ? (
//                 <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>
//                   Buy
//                 </Button>
//               ) : (
//                 <Typography color="error" style={{ marginTop: '20px' }}>Sold</Typography>
//               )}

//               <Button
//                 variant="contained"
//                 color={isFavorited ? 'secondary' : 'default'}
//                 onClick={handleFavoriting}
//                 style={{ marginTop: '20px', marginLeft: '10px' }}
//               >
//                 {isFavorited ? 'Unfavorite' : 'Favorite'}
//               </Button>

//               <Typography style={{ marginTop: '20px' }}>Time spent on this page: {timeSpent} seconds</Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default HouseDetail;


//-------------------------------------------------------------------------------------

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Container, Typography, Button, CardMedia, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useParams, useNavigate } from 'react-router-dom';

const HouseDetail = () => {
  const { houseId } = useParams();
  const navigate = useNavigate();
  const [house, setHouse] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [similarHouses, setSimilarHouses] = useState([]);
  const timeSpentRef = useRef(0);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    let intervalId;
    const startTime = Date.now();

    const fetchHouseDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/houses/${houseId}`);
        setHouse(res.data);

        if (userId) {
          const favoriteRes = await axios.get(`http://localhost:5000/houses/${houseId}/isFavorited`, { params: { userId } });
          setIsFavorited(favoriteRes.data.isFavorited);

          await axios.post(`http://localhost:5000/houses/${houseId}/interaction`, { userId });
        }
      } catch (error) {
        console.error("Error fetching house details:", error);
      }
    };

    fetchHouseDetail();

    intervalId = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      setTimeSpent(elapsedSeconds);
      timeSpentRef.current = elapsedSeconds;
    }, 1000);

    return () => {
      clearInterval(intervalId);
      if (userId && houseId) {
        updateTimeSpent();
      }
    };
  }, [houseId, userId]);

  const updateTimeSpent = async () => {
    if (!userId || !houseId) return;

    try {
      await axios.post(`http://localhost:5000/houses/${houseId}/updateTimeSpent`, { userId, timeSpent: timeSpentRef.current });
    } catch (error) {
      console.error("Error updating time spent:", error);
    }
  };

  const handleFavoriting = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/houses/${houseId}/favorite`, { userId });
      setIsFavorited(response.data.favorited);
    } catch (error) {
      console.error("Error favoriting house:", error);
    }
  };

  const handleCompare = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/houses/${houseId}/similar`);
      setSimilarHouses(res.data);
      navigate('/compare', { state: { baseHouse: house, similarHouses: res.data } });
    } catch (error) {
      console.error("Error fetching similar houses for comparison:", error);
    }
  };

  if (!house) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>{house.title}</Typography>

      <Grid container spacing={4}>
        <Grid xs={12} md={6}>
          {house.images && house.images.length > 0 && house.images.map((image, index) => (
            <CardMedia
              key={index}
              component="img"
              height="200"
              image={image}
              alt={`${house.title} image ${index + 1}`}
              style={{ marginBottom: '10px' }}
            />
          ))}
        </Grid>

        <Grid>
          {house.videos && house.videos.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <Typography variant="h6">Videos</Typography>
              {house.videos.map((video, index) => (
                <video key={index} width="100%" controls style={{ marginBottom: '10px' }}>
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ))}
            </div>
          )}
        </Grid>

        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Description</Typography>
              <Typography>{house.description}</Typography>

              <Typography variant="h6">Location</Typography>
              <Typography>{house.location}</Typography>

              <Typography variant="h6">Price</Typography>
              <Typography>₹{house.price}</Typography>

              <Typography variant="h6">Area Type</Typography>
              <Typography>{house.area_type}</Typography>

              <Typography variant="h6">Size</Typography>
              <Typography>{house.size}</Typography>

              <Typography variant="h6">Bathrooms</Typography>
              <Typography>{house.bath}</Typography>

              <Typography variant="h6">Balconies</Typography>
              <Typography>{house.balcony}</Typography>

              <Typography variant="h6">Total Square Feet</Typography>
              <Typography>{house.total_sqft}</Typography>

              {house.isAvailable ? (
                <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>
                  Buy
                </Button>
              ) : (
                <Typography color="error" style={{ marginTop: '20px' }}>Sold</Typography>
              )}

              <Button
                variant="contained"
                color={isFavorited ? 'secondary' : 'default'}
                onClick={handleFavoriting}
                style={{ marginTop: '20px', marginLeft: '10px' }}
              >
                {isFavorited ? 'Unfavorite' : 'Favorite'}
              </Button>

              <Button
                variant="outlined"
                color="primary"
                onClick={handleCompare}
                style={{ marginTop: '20px', marginLeft: '10px' }}
              >
                Compare
              </Button>

              <Typography style={{ marginTop: '20px' }}>Time spent on this page: {timeSpent} seconds</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HouseDetail;



