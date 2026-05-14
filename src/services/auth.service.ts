import api from '@/lib/axios';

export const authService = {
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  sendOtp: async () => {
    const response = await api.post('/auth/email/send-otp');
    return response.data;
  },

  verifyOtp: async (otp: string) => {
    const response = await api.post('/auth/email/verify-otp', { otp });
    return response.data;
  },

  getUserDetails: async (userId: string) => {
    const response = await api.get(`/auth/user/${userId}`);
    return response.data;
  },
};
