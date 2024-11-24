// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import { Container, TextField, Button, Typography, List, ListItem, ListItemText } from '@mui/material';

// const ChatPage = () => {
//   const { sellerId } = useParams();
//   const buyerId = localStorage.getItem('userId'); // Assuming userId is stored in local storage
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [sellerDetails, setSellerDetails] = useState(null);

//   useEffect(() => {
//     const fetchChat = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/chats/${sellerId}`, { params: { buyerId } });
//         setMessages(res.data.messages);

//         // Fetch seller details
//         const sellerRes = await axios.get(`http://localhost:5000/users/${sellerId}`);
//         setSellerDetails(sellerRes.data);
//       } catch (error) {
//         console.error('Error fetching chat:', error);
//       }
//     };

//     fetchChat();
//   }, [sellerId, buyerId]);

//   const sendMessage = async () => {
//     if (!newMessage.trim()) return;

//     try {
//       const res = await axios.post(`http://localhost:5000/chats/${sellerId}/message`, {
//         buyerId,
//         senderId: buyerId,
//         text: newMessage,
//       });
//       setMessages(res.data.chat.messages);
//       setNewMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   return (
//     <Container>
//       <Typography variant="h4" gutterBottom>
//         Chat with {sellerDetails ? sellerDetails.name : 'Seller'}
//       </Typography>

//       <List>
//         {messages.map((message, index) => (
//           <ListItem key={index} style={{ alignItems: 'flex-start' }}>
//             <ListItemText
//               primary={message.senderId === buyerId ? 'You' : 'Seller'}
//               secondary={message.text}
//               style={{
//                 textAlign: message.senderId === buyerId ? 'right' : 'left',
//                 backgroundColor: message.senderId === buyerId ? '#e0f7fa' : '#f1f8e9',
//                 padding: '10px',
//                 borderRadius: '5px',
//               }}
//             />
//           </ListItem>
//         ))}
//       </List>

//       <TextField
//         value={newMessage}
//         onChange={(e) => setNewMessage(e.target.value)}
//         fullWidth
//         placeholder="Type your message"
//         variant="outlined"
//         style={{ marginTop: '20px' }}
//       />
//       <Button variant="contained" color="primary" onClick={sendMessage} style={{ marginTop: '10px' }}>
//         Send
//       </Button>
//     </Container>
//   );
// };

// export default ChatPage;

//-------------------------------------------------------------------------------

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import { Container, TextField, Button, Typography, List, ListItem, ListItemText } from '@mui/material';

// const ChatPage = () => {
//   const { sellerId } = useParams();
//   const buyerId = localStorage.getItem('userId'); // Assuming userId is stored in local storage
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [sellerDetails, setSellerDetails] = useState(null);

//   useEffect(() => {
//     const fetchChat = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/chats/${sellerId}`, { params: { buyerId } });
//         setMessages(res.data.messages);

//         // Fetch seller details
//         const sellerRes = await axios.get(`http://localhost:5000/users/${sellerId}`);
//         setSellerDetails(sellerRes.data);
//       } catch (error) {
//         console.error('Error fetching chat:', error);
//       }
//     };

//     fetchChat();
//   }, [sellerId, buyerId]);

//   const sendMessage = async () => {
//     if (!newMessage.trim()) return;

//     try {
//       const res = await axios.post(`http://localhost:5000/chats/${sellerId}/message`, {
//         buyerId,
//         senderId: buyerId,
//         text: newMessage,
//       });
//       setMessages(res.data.chat.messages);
//       setNewMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   return (
//     <Container>
//       <Typography variant="h4" gutterBottom>
//         Chat with {sellerDetails ? sellerDetails.name : 'Seller'}
//       </Typography>

//       <List style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
//         {messages.map((message, index) => (
//           <ListItem key={index} style={{ justifyContent: message.senderId === buyerId ? 'flex-end' : 'flex-start' }}>
//             <ListItemText
//               primary={message.text}
//               secondary={message.senderId === buyerId ? 'You' : sellerDetails?.name || 'Seller'}
//               style={{
//                 textAlign: message.senderId === buyerId ? 'right' : 'left',
//                 backgroundColor: message.senderId === buyerId ? '#e0f7fa' : '#f1f8e9',
//                 padding: '10px',
//                 borderRadius: '10px',
//                 maxWidth: '70%',
//               }}
//             />
//           </ListItem>
//         ))}
//       </List>

//       <TextField
//         value={newMessage}
//         onChange={(e) => setNewMessage(e.target.value)}
//         fullWidth
//         placeholder="Type your message"
//         variant="outlined"
//         style={{ marginTop: '20px' }}
//       />
//       <Button variant="contained" color="primary" onClick={sendMessage} style={{ marginTop: '10px' }}>
//         Send
//       </Button>
//     </Container>
//   );
// };

// export default ChatPage;

//------------------------------------------------------------------------------

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { fetchChat } from '../../api';
import { useParams } from 'react-router-dom';

const socket = io('http://localhost:5000');

const BuyerChatPage = () => {
  const { sellerId } = useParams(); // Get sellerId from URL params
  const buyerId = localStorage.getItem('userId'); // Replace with the actual logic to fetch buyerId
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    const loadChat = async () => {
      const response = await fetchChat(sellerId, buyerId);
      setMessages(response.data.messages);
      setChatId(response.data.chatId);
      socket.emit('joinChat', response.data.chatId);
    };

    loadChat();

    socket.on('messageReceived', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off('messageReceived');
  }, [buyerId, sellerId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = { chatId, senderId: buyerId, text: newMessage };
    socket.emit('sendMessage', messageData);
    setNewMessage('');
  };

  return (
    <div>
      <h2>Chat with Seller</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.senderId === buyerId ? 'You: ' : 'Seller: '}
            {msg.text}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default BuyerChatPage;
