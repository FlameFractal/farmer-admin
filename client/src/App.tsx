import React, { useEffect, useState } from 'react';

import axiosInstance from './axiosConfig';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get('/health');
      setMessage(response.data.message);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default App;
