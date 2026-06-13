import axios from 'axios';

const baseURL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api`;

const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use((config) => {
  const accessToken = window.localStorage.getItem('accessToken');

  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default httpClient;
