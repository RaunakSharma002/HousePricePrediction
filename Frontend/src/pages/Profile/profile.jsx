import React, { useState } from 'react';
import HouseForm from '../../components/HouseForm/houseForm';

const Profile = () => {
  const [token, setToken] = useState('');

  return (
    <div>
      <h1>Your Profile</h1>
      {/* <HouseForm token={token} /> */}
      <HouseForm/>
    </div>
  );
};

export default Profile;
