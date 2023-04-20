import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
  Grid, IconButton, InputAdornment,
} from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';

import axios from '../axiosConfig';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string>('');

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleLogin = async () => {
    try {
      const response = await axios.post('/auth/login', { username, password });
      const { token } = response.data;
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem('token', token);
      onLogin();
    } catch (err: any) {
      setMessage(`An error occured. ${err?.response?.data?.message}`);
    }
  };

  return (
    <Grid sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
    }}
    >
      <Typography variant="h3" gutterBottom>
        Farmer Admin
      </Typography>

      <Grid sx={{ maxWidth: '300px', width: '100%', margin: '0 auto' }}>
        <TextField
          label="Username"
          variant="outlined"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={() => setMessage('')}
          sx={{ width: '100%' }}
        />

        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={() => setMessage('')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ width: '100%' }}
        />
      </Grid>

      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login
      </Button>

      {message && <Typography color="error">{message}</Typography>}
    </Grid>
  );
}
