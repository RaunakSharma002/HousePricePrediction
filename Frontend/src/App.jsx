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
      </Routes>
    </Router>
  );
};

export default App;

