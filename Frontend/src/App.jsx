// import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
// import DataEntry from "./components/DataEntry/dataEntry"
// import Prediction from "./components/Prediction/prediction"
// import Navbar from "./components/Home/navbar"
// import HouseList from "./components/HouseList/houseList"

// function App() {
//   return (
//     <>
//       <Router>
//         <Navbar/>
//         <Routes>
//           <Route path="/" element={<DataEntry/>}/>
//           <Route path="/prediction" element={<Prediction/>}/>
//           <Route path="/houseList" element={<HouseList/>}/>
//         </Routes>
//       </Router>
//     </>
//   )
// }

// export default App


//--------------------------------------------------------------------

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/homePage';
import Register from './pages/Register/register';
import Profile from './pages/Profile/profile';
import Navbar from "./components/Home/navbar";
import HouseDetail from './components/HouseDetail/houseDetail';
import ComparePage from './components/Compare/ComparePage';
import ContactSeller from './components/ContactSeller/contactSeller';
// import ChatPage from './components/ChatPage/chat';
import SellerChats from './components/SellerChat/sellerChats';
import SellerChatDetails from './components/SellerChatDetails/sellerChatDetails';

const App = () => {
  return (
    <Router>
      <Navbar></Navbar>
      <div style={{ margin: "20px" }}></div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/house/:houseId" element={<HouseDetail />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/contact-seller/:sellerId" element={<ContactSeller />} />
        {/* <Route path="/chat/:sellerId" element={<ChatPage />} /> */}
        <Route path="/sellerChat" element={<SellerChats />} />
        <Route path="/seller/chat/:chatId" element={<SellerChatDetails />} />
      </Routes>
    </Router>
  );
};

export default App;

