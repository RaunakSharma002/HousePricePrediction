// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import { Container, List, ListItem, ListItemText, TextField, Button, Typography } from '@mui/material';

// const SellerChatDetails = () => {
//   const { chatId } = useParams();
//   const sellerId = localStorage.getItem('userId'); // Assuming seller's ID is stored in localStorage
//   const [chat, setChat] = useState(null);
//   const [newMessage, setNewMessage] = useState('');

//   useEffect(() => {
//     const fetchChat = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/chats/seller/${sellerId}/chat/${chatId}`);
//         setChat(res.data.chat);
//       } catch (error) {
//         console.error('Error fetching chat:', error);
//       }
//     };

//     fetchChat();
//   }, [chatId, sellerId]);

//   const sendMessage = async () => {
//     if (!newMessage.trim()) return;

//     console.log(chat.propertyId);
  
//     try {
//       const res = await axios.post(`http://localhost:5000/chats/${chat.sellerId}/message`, {
//         propertyId: chat.propertyId, // Include the propertyId
//         buyerId: chat.buyerId._id,
//         senderId: sellerId,
//         text: newMessage,
//       });
//       setMessages(res.data.chat.messages);
//       setNewMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };
  

//   if (!chat) return <Typography>Loading chat...</Typography>;

//   return (
//     <Container>
//       <Typography variant="h5" gutterBottom>
//         Chat about Property: {chat.propertyId}
//       </Typography>
//       <Typography variant="subtitle1" gutterBottom>
//         Buyer: {chat.buyerId.name} ({chat.buyerId.email})
//       </Typography>

//       <List style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
//         {chat.messages.map((message, index) => (
//           <ListItem
//             key={index}
//             style={{ justifyContent: message.senderId._id === sellerId ? 'flex-end' : 'flex-start' }}
//           >
//             <ListItemText
//               primary={message.text}
//               secondary={message.senderId.name}
//               style={{
//                 textAlign: message.senderId._id === sellerId ? 'right' : 'left',
//                 backgroundColor: message.senderId._id === sellerId ? '#e0f7fa' : '#f1f8e9',
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

// export default SellerChatDetails;

//-------------------------------------------------------------------------

// import { useEffect, useState } from 'react';
// import io from 'socket.io-client';
// import { fetchChat } from '../../api';

// const socket = io('http://localhost:5000');

// const SellerChatDetails = ({ sellerId, buyerId }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [chatId, setChatId] = useState(null);

//   useEffect(() => {
//     const loadChat = async () => {
//       const response = await fetchChat(sellerId, buyerId);
//       setMessages(response.data.messages);
//       setChatId(response.data.chatId);
//       socket.emit('joinChat', response.data.chatId);
//     };

//     loadChat();

//     socket.on('messageReceived', (message) => {
//       setMessages((prev) => [...prev, message]);
//     });

//     return () => socket.off('messageReceived');
//   }, [sellerId, buyerId]);

//   const sendMessage = () => {
//     if (!newMessage.trim()) return;

//     const messageData = { chatId, senderId: sellerId, text: newMessage };
//     socket.emit('sendMessage', messageData);
//     setNewMessage('');
//   };

//   return (
//     <div>
//       <h2>Chat with Buyer</h2>
//       <ul>
//         {messages.map((msg, index) => (
//           <li key={index}>
//             {msg.senderId === sellerId ? 'You: ' : 'Buyer: '}
//             {msg.text}
//           </li>
//         ))}
//       </ul>
//       <input
//         type="text"
//         value={newMessage}
//         onChange={(e) => setNewMessage(e.target.value)}
//         placeholder="Type your message..."
//       />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// };

// export default SellerChatDetails;

//-------------------------------------------------------------------

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { fetchChat } from '../../api';

const socket = io('http://localhost:5000');

const SellerChatDetails = ({ sellerId, buyerId }) => {
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
  }, [sellerId, buyerId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = { chatId, senderId: sellerId, text: newMessage };
    socket.emit('sendMessage', messageData);
    setNewMessage('');
  };

  return (
    <div>
      <h2>Chat with Buyer</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.senderId === sellerId ? 'You: ' : 'Buyer: '}
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

export default SellerChatDetails;
