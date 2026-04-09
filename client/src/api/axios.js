import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:3001/api'),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  isRefreshing = false;
  failedQueue = [];
};

// Request Interceptor: add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: handle token refresh and 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // No refresh token, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      return api
        .post('/auth/refresh', { refreshToken })
        .then(res => {
          const { accessToken } = res.data;
          localStorage.setItem('accessToken', accessToken);
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          processQueue(null, accessToken);
          return api(originalRequest);
        })
        .catch(err => {
          // Refresh failed, clear auth and redirect
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          processQueue(err, null);
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          return Promise.reject(err);
        });
    }

    return Promise.reject(error);
  }
);

export default api;
