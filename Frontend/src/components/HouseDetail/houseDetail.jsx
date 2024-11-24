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


//------------------------------------------------------------------------------------------

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Container, Typography, Button, CardMedia, Card, CardContent, TextField, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useParams, useNavigate } from 'react-router-dom';

const HouseDetail = () => {
  const { houseId } = useParams();
  const navigate = useNavigate();
  const [house, setHouse] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [similarHouses, setSimilarHouses] = useState([]);
  const [years, setYears] = useState(1);  // Default years to 1
  const [predictedPrice, setPredictedPrice] = useState(null);  // State to store predicted price
  const [reportReason, setReportReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const timeSpentRef = useRef(0);

  const userId = localStorage.getItem('userId');

  const reportOptions = [
    'Wrong images',
    'Wrong video',
    'Incorrect location',
    'Missing amenities',
    'Other',
  ];

  useEffect(() => {
    let intervalId;
    const startTime = Date.now();

    const fetchHouseDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/houses/${houseId}`);
        setHouse(res.data);

        const feedbackRes = await axios.get(`http://localhost:5000/houses/${houseId}/feedbacks`);
        setFeedbacks(feedbackRes.data);

        if (userId) {
          const favoriteRes = await axios.get(`http://localhost:5000/houses/${houseId}/isFavorited`, { params: { userId } });
          setIsFavorited(favoriteRes.data.isFavorited);

          await axios.post(`http://localhost:5000/houses/${houseId}/interaction`, { userId });
        }
      } catch (error) {
        console.error("Error fetching house details:", error.response || error.message || error);
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

  const handleBuy = async () => {
    try {
      const response = await axios.post('http://localhost:5000/transactions/buy', {
        houseId,
        userId,
        purchaseDate: new Date()
      });

      if (response.data.success) {
        // Optionally, you could navigate to another page or show a success message
        alert('Transaction successful!');
      }
    } catch (error) {
      console.error("Error processing transaction:", error);
    }
  };

  const handleGetPriceInsight = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/houses/${houseId}/priceInsight`, { years });
      if (response.data.success) {
        setPredictedPrice(response.data.predictedPrice);
      }
    } catch (error) {
      console.error("Error fetching price insight:", error);
    }
  };

  const handleSubmitReport = async () => {
    if (!reportReason) {
      setError('Please select a reason for reporting.');
      return;
    }

    if (reportReason === 'Other' && !otherReason.trim()) {
      setError('Please provide a reason for reporting.');
      return;
    }

    setError('');

    try {
      await axios.post(`http://localhost:5000/houses/${houseId}/report`, {
        userId,
        reason: reportReason === 'Other' ? otherReason : reportReason,
      });

      alert('Report submitted successfully!');
      setReportReason('');
      setOtherReason('');
    } catch (error) {
      console.error("Error submitting report:", error.response || error.message || error);
      setError('An error occurred while submitting the report. Please try again later.');
    }
  };

  const handleSubmitFeedback = async () => {
    if (!rating) {
      alert('Please provide a rating.');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/houses/${houseId}/feedback`, {
        userId,
        rating,
        comment: feedbackComment,
      });

      const updatedFeedbacks = await axios.get(`http://localhost:5000/houses/${houseId}/feedbacks`);
      console.log("Updated Feedbacks:", updatedFeedbacks.data); // Debugging
      setFeedbacks(updatedFeedbacks.data);

      setRating(0);
      setFeedbackComment('');
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error("Error submitting feedback:", error.response || error.message || error);
    }
  };

  if (!house) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>{house.title}</Typography>

      {/* Report Section */}
      <Typography variant="h5" gutterBottom>Report House</Typography>
      <TextField
        select
        label="Select Reason"
        value={reportReason}
        onChange={(e) => setReportReason(e.target.value)}
        fullWidth
        margin="normal"
      >
        {reportOptions.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      {reportReason === 'Other' && (
        <TextField
          label="Specify Reason"
          value={otherReason}
          onChange={(e) => setOtherReason(e.target.value)}
          fullWidth
          margin="normal"
        />
      )}

      {error && (
        <Typography color="error" variant="body2" gutterBottom>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmitReport}
        style={{ marginBottom: '20px' }}
      >
        Submit Report
      </Button>

      {/* Main House Details */}
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
                <Button variant="contained" color="primary" onClick={handleBuy} style={{ marginTop: '20px' }}>
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

              <TextField
                label="Enter years"
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                fullWidth
                style={{ marginTop: '20px' }}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleGetPriceInsight}
                style={{ marginTop: '10px' }}
              >
                Get Insight
              </Button>

              {predictedPrice && (
                <Typography variant="h6" style={{ marginTop: '20px' }}>
                  Predicted Price after {years} years: ₹{predictedPrice}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
  
              
      {/*Button for contact page*/}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(`/contact-seller/${house.seller._id}`)}
        style={{ marginTop: '20px', marginLeft: '10px' }}
      >
        Contact Seller
      </Button>


      {/* Feedback Section */}
      <Typography variant="h5" gutterBottom style={{ marginTop: '40px' }}>Feedback</Typography>
      <TextField
        label="Rating (1-5)"
        type="number"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Comment"
        value={feedbackComment}
        onChange={(e) => setFeedbackComment(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmitFeedback}
        style={{ marginBottom: '20px' }}
      >
        Submit Feedback
      </Button>

      {/* Display Feedbacks */}
      <Typography variant="h6" gutterBottom>Previous Feedback</Typography>
      {feedbacks.length > 0 ? (
        feedbacks.map((feedback, index) => (
          <Card key={index} style={{ marginBottom: '10px' }}>
            <CardContent>
              <Typography><strong>User:</strong> {feedback.user}</Typography>
              <Typography><strong>Rating:</strong> {feedback.rating}</Typography>
              <Typography><strong>Comment:</strong> {feedback.comment}</Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No feedback available yet.</Typography>
      )}
    </Container>
  );
};

export default HouseDetail;





