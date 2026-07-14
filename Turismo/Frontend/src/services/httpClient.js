import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
});

// Agrega el token de acceso a cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Variables para gestionar el refresco de token (evitar peticiones duplicadas)
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // Solo intentar refresh en errores 401 que no sean del propio refresh ni del checkAuth inicial
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes('refresh-token') &&
      !original.url?.includes('login')
    ) {
      // Si ya hay un refresco en progreso, encolar esta petición
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return api(original);
          })
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        // No hay refresh token: ir al login
        isRefreshing = false;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${BASE_URL}/usuarios/refresh-token/`, {
          refresh: refreshToken,
        });

        // El backend normaliza: res.data.data.access
        const newAccessToken = res.data?.data?.access || res.data?.access;
        if (!newAccessToken) throw new Error('No se obtuvo nuevo token de acceso');

        localStorage.setItem('access_token', newAccessToken);
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        original.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Solo redirigir si no estamos en /login ya
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
