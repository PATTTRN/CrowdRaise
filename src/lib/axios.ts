import axios from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000', // https://crowdraise-backend.onrender.com
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here, like logging out on 401
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Accessing store outside of React component
        useAuthStore.getState().logout();
        
        // Notify user and open modal
        toast.error('Session expired. Please log in again.');
        window.dispatchEvent(new CustomEvent('open-auth-modal'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
