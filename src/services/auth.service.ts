import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { setAuthCookie, clearAuthCookie } from '@/lib/auth-cookie';
import type { ApiResponse, User, RegisterPayload, LoginPayload } from '@/lib/api-types';

export const authService = {
  register: async (userData: RegisterPayload) => {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: LoginPayload) => {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', credentials);
    if (response.data.data) {
      const { user, token } = response.data.data;
      useAuthStore.getState().setAuth(user, token);
      setAuthCookie(token);
    }
    return response.data;
  },

  logout: () => {
    useAuthStore.getState().logout();
    clearAuthCookie();
  },

  getCurrentUser: () => {
    return useAuthStore.getState().user;
  },

  sendOtp: async () => {
    const response = await api.post<ApiResponse<unknown>>('/auth/email/send-otp');
    return response.data;
  },

  verifyOtp: async (otp: string) => {
    const response = await api.post<ApiResponse<unknown>>('/auth/email/verify-otp', { otp });
    return response.data;
  },

  getUserDetails: async (userId: string) => {
    const response = await api.get<ApiResponse<User>>(`/auth/user/${userId}`);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (email: string, token: string, newPassword: string) => {
    const response = await api.post('/auth/reset-password', { email, token, newPassword });
    return response.data;
  },
};
