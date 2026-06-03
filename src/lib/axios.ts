import axios from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';
import * as Sentry from '@sentry/nextjs';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status >= 500) {
      Sentry.captureException(error, {
        extra: {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          body: error.config?.data,
        },
      });
    }

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        useAuthStore.getState().logout();
        toast.error('Session expired. Please log in again.');
        window.dispatchEvent(new CustomEvent('open-auth-modal'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
