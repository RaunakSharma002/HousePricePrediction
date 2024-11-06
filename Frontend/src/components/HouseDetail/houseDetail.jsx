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

//----------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Button, CardMedia, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useParams } from 'react-router-dom';

const HouseDetail = () => {
  const { houseId } = useParams();
  const [house, setHouse] = useState(null);

  useEffect(() => {
    const fetchHouseDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/houses/${houseId}`);
        setHouse(res.data);
      } catch (error) {
        console.error("Error fetching house details:", error);
      }
    };
    fetchHouseDetail();
  }, [houseId]);

  if (!house) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>{house.title}</Typography>

      <Grid container spacing={4}>
        {/* Images Section */}
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

        {/* Details and Video Section */}
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

              {/* Videos Section */}
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

              {/* Availability Button */}
              {house.isAvailable ? (
                <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>
                  Buy
                </Button>
              ) : (
                <Typography color="error" style={{ marginTop: '20px' }}>Sold</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HouseDetail;

