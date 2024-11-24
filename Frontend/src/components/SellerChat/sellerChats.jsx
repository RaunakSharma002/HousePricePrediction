// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Container, List, ListItem, ListItemText, Typography } from '@mui/material';

// const SellerChats = () => {
//   const sellerId = localStorage.getItem('userId'); // Assuming seller's ID is stored in localStorage
//   const navigate = useNavigate();
//   const [chats, setChats] = useState([]);

//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/chats/seller/${sellerId}/chats`);
//         setChats(res.data.chats);
//       } catch (error) {
//         console.error('Error fetching chats:', error);
//       }
//     };

//     fetchChats();
//   }, [sellerId]);

//   return (
//     <Container>
//       <Typography variant="h4" gutterBottom>
//         Chats
//       </Typography>
//       <List>
//         {chats.map((chat) => (
//           <ListItem
//             key={chat._id}
//             component="button"
//             onClick={() => navigate(`/seller/chat/${chat._id}`)}
//             // onClick={() => window.location.href = `/seller/chat/${chat._id}`} // Navigate to chat page
//           >
//             <ListItemText
//               primary={`Property: ${chat.propertyId}`}
//               secondary={`Buyer: ${chat.buyerId.name} - ${chat.buyerId.email}`}
//             />
//           </ListItem>
//         ))}
//       </List>
//     </Container>
//   );
// };

// export default SellerChats;

//-----------------------------------------------------------------

import { useEffect, useState } from 'react';
import { fetchChatsForSeller } from '../../api';

const SellerChatList = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]);
    const sellerId = localStorage.getItem('userId');

  useEffect(() => {
    const loadChats = async () => {
      const response = await fetchChatsForSeller(sellerId);
      setChats(response.data);
    };

    loadChats();
  }, [sellerId]);

  return (
    <div>
      <h2>Chats</h2>
      <ul>
        {chats.map((chat) => (
          <li key={chat._id} onClick={() => onSelectChat(chat._id)}>
            Chat with {chat.buyerId.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SellerChatList;
