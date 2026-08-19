import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach Bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jmc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent data extraction and error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status || 500;
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected API error occurred',
      status,
      data: error.response?.data || null,
    };

    // If 401 Unauthorized occurs on admin endpoints, clear session
    if (status === 401 && !error.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('jmc_token');
      localStorage.removeItem('jmc_user');
      localStorage.removeItem('jmc_admin_auth');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(customError);
  }
);

export default api;

