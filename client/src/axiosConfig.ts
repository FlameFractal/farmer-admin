import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5656/api',
  timeout: 5000
});

export default axiosInstance;