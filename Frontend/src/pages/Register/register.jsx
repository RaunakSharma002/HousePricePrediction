import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import api from '../../api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await api.post('/auth/register', { name, email, password });
      alert("User registered successfully!");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div>
      <TextField label="Name" fullWidth margin="normal" onChange={(e) => setName(e.target.value)} />
      <TextField label="Email" fullWidth margin='normal' onChange={(e) => setEmail(e.target.value)} />
      <TextField label="Password" fullWidth margin='normal' type="password" onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={handleRegister}>Register</Button>
    </div>
  );
};

export default Register;
