import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { useParams } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, TextField } from '@mui/material';
// import ChatPage from '../ChatPage/chat';
import BuyerChatPage from '../BuyerChatPage/buyerChatPage';

const ContactSeller = () => {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/houses/users/${sellerId}`);
        setSeller(res.data);
      } catch (error) {
        console.error("Error fetching seller details:", error.response || error.message || error);
      }
    };

    // const fetchChatHistory = async () => {
    //   try {
    //     const res = await axios.get(`http://localhost:5000/chats/${sellerId}`);
    //     setChatHistory(res.data);
    //   } catch (error) {
    //     console.error("Error fetching chat history:", error.response || error.message || error);
    //   }
    // };

    fetchSellerDetails();
    // fetchChatHistory();
  }, [sellerId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      await axios.post(`http://localhost:5000/chats`, { sellerId, message });
      setMessage('');
      const updatedHistory = await axios.get(`http://localhost:5000/chats/${sellerId}`);
      setChatHistory(updatedHistory.data);
    } catch (error) {
      console.error("Error sending message:", error.response || error.message || error);
    }
  };

  if (!seller) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Contact Seller</Typography>
      <Typography variant="h6">Name: {seller.name}</Typography>
      <Typography variant="h6">Email: {seller.email}</Typography>
      <Typography variant="h6">Phone: {seller.phone}</Typography>
{/* 
      {console.log(seller._id)}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(`/chat/${seller._id}`)} // Assuming `seller` contains the seller's ID
        style={{ marginTop: '20px' }}
      >
        Contact Seller
      </Button> */}


      {/* <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>Chat with Seller</Typography>
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
        {chatHistory.length > 0 ? (
          chatHistory.map((chat, index) => (
            <Typography key={index} style={{ marginBottom: '10px' }}>
              <strong>{chat.sender}:</strong> {chat.message}
            </Typography>
          ))
        ) : (
          <Typography>No messages yet.</Typography>
        )}
      </div>
      <TextField
        label="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSendMessage}
      >
        Send Message
      </Button> */}

      <BuyerChatPage></BuyerChatPage>
    </Container>
  );
};

export default ContactSeller;

//--------------------------------------------------------------------------------

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import { Container, Typography, TextField, Button } from '@mui/material';

// const ContactSeller = () => {
//   const { sellerId } = useParams();
//   const buyerId = localStorage.getItem('userId');
//   const [seller, setSeller] = useState(null);
//   const [message, setMessage] = useState('');
//   const [chatHistory, setChatHistory] = useState([]);

//   useEffect(() => {
//     // Fetch seller details
//     const fetchSellerDetails = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/houses/users/${sellerId}`);
//         setSeller(res.data);
//       } catch (error) {
//         console.error("Error fetching seller details:", error.response || error.message || error);
//       }
//     };

//     // Fetch chat history
//     const fetchChatHistory = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/chats/${sellerId}`);
//         setChatHistory(res.data);
//       } catch (error) {
//         console.error("Error fetching chat history:", error.response || error.message || error);
//       }
//     };

//     fetchSellerDetails();
//     fetchChatHistory();
//   }, [sellerId]);

//   // Handle sending messages
//   const handleSendMessage = async () => {
//   if (!message.trim()) return;

//   try {
//     // const buyerId = "currentBuyerId"; // Replace with the actual buyer ID (e.g., from context or state)
//     // const senderId = "currentUserId"; // Replace with the actual sender ID (e.g., from context or state)
    
//     const response = await axios.post(`http://localhost:5000/chats/${sellerId}/message`, {
//       buyerId,
//       senderId : buyerId,
//       text: message, // Aligning with the `text` field in the backend
//     });

//     setMessage('');
//     setChatHistory(response.data.chat.messages); // Updating chat history from the response
//   } catch (error) {
//     console.error("Error sending message:", error.response || error.message || error);
//   }
// };


//   if (!seller) {
//     return <Typography>Loading...</Typography>;
//   }

//   return (
//     <Container>
//       {/* Seller Details */}
//       <Typography variant="h4" gutterBottom>Contact Seller</Typography>
//       <Typography variant="h6">Name: {seller.name}</Typography>
//       <Typography variant="h6">Email: {seller.email}</Typography>
//       <Typography variant="h6">Phone: {seller.phone}</Typography>

//       {/* Chat Section */}
//       <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>Chat with Seller</Typography>
//       <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
//         {chatHistory.length > 0 ? (
//           chatHistory.map((chat, index) => (
//             <Typography key={index} style={{ marginBottom: '10px' }}>
//               <strong>{chat.sender}:</strong> {chat.message}
//             </Typography>
//           ))
//         ) : (
//           <Typography>No messages yet.</Typography>
//         )}
//       </div>
      
//       {/* Message Input */}
//       <TextField
//         label="Message"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         fullWidth
//         margin="normal"
//       />
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleSendMessage}
//       >
//         Send Message
//       </Button>
//     </Container>
//   );
// };

// export default ContactSeller;
