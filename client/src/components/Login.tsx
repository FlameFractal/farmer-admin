import React, { useState } from 'react';
import axios from '../axiosConfig';

export default function Login({ onLogin }: {onLogin: () => void;}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string>('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/auth/login', { username, password });
      const { token } = response.data;
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem('token', token);
      onLogin();
    } catch (err: any) {
      setMessage(err?.response?.data?.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <span>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={() => setMessage('')} />
      </span>
      <br />

      <span>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={() => setMessage('')} />
      </span>
      <br />

      <button type="button" onClick={handleLogin}>Login</button>

      {message && <div>{message}</div>}
    </div>
  );
}
