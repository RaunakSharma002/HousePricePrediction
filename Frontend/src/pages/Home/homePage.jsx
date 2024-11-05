// import React, { useState } from 'react';
// import Login from '../../components/Login/login';
// import HouseList from '../../components/HouseList/houseList';

// const HomePage = () => {
//   const [token, setToken] = useState('');

//   return (
//     <div>
//       <h1>House Marketplace</h1>
//       {token ? <HouseList token={token} /> : <Login setToken={setToken} />}
//       {/* <HouseList/> */}
//     </div>
//   );
// };

// export default HomePage;

//---------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import Login from '../../components/Login/login';
import HouseList from '../../components/HouseList/houseList';

const HomePage = () => {
  const [token, setToken] = useState('');

  // Check for token in localStorage on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);  // Restore token from localStorage
    }
  }, []);

  const handleLogout = () => {
    setToken(''); // Clear token state
    localStorage.removeItem('token'); // Remove token from localStorage
  };

  return (
    <div>
      <h1>House Marketplace</h1>
      {token ? (
        <div>
          <button onClick={handleLogout}>Logout</button> {/* Logout button */}
          <HouseList token={token} />
        </div>
      ) : (
        <Login setToken={setToken} />
      )}
    </div>
  );
};

export default HomePage;
