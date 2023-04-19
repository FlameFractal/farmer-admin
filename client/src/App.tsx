import React, { useEffect, useState } from 'react';
import axios from './axiosConfig';
import HomePage from './components/Home';
import Login from './components/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        if (response.data) {
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;
          setIsLoggedIn(true);
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      });
  }, []);

  return (
    <div>
      {!isLoggedIn ? (
        <Login onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <HomePage onLogout={() => {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }}
        />
      )}
    </div>
  );
}

export default App;
