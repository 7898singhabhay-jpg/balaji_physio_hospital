import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, Container, Paper, TextField, Typography, Alert } from '@mui/material';
import api from '../api/api';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 6 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          Admin Signup
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
          <TextField label="Name" required value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <TextField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
          <Button type="submit" variant="contained" size="large">Sign Up</Button>
        </Box>
        <Typography sx={{ mt: 2 }}>
          Already registered? <Link to="/login">Login</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default SignupPage;
