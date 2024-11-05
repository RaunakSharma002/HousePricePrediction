import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import api from '../../api';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const token = response.data.token;
      setToken(token);
      localStorage.setItem('token', token); 
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <TextField label="Email" fullWidth margin='normal' onChange={(e) => setEmail(e.target.value)} />
      <TextField label="Password" fullWidth margin='normal' type="password" onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
};

export default Login;
