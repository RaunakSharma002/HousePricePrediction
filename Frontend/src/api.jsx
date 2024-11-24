// import axios from 'axios';

// const API_URL = 'http://localhost:5000/';

// const api = axios.create({
//   baseURL: API_URL,
// });

// export default api;

//------------------------------------------------------

import axios from 'axios';

const API_URL = 'http://localhost:5000/';

const api = axios.create({
  baseURL: API_URL,
});

// Fetch or create a chat between buyer and seller
export const fetchChat = (sellerId, buyerId) =>
  api.get(`/chats/${sellerId}`, { params: { buyerId } });

// Fetch all chats for a seller
export const fetchChatsForSeller = (sellerId) =>
  api.get(`/chats/seller/${sellerId}`);

// Export the Axios instance for general use
export default api;

