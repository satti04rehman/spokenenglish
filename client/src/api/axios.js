import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api'),
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
      // Check if this is an initial auth check (no auth token attempted)
      const hasAuth = originalRequest.headers['Authorization'];

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
        // No refresh token available
        // If there was no auth header, this was just a check - silently reject
        // If there was an auth header, we need to redirect to login
        if (hasAuth) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        isRefreshing = false;
        failedQueue = [];
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
