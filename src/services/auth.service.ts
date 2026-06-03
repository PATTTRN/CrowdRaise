import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
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
    }
    return response.data;
  },

  logout: () => {
    useAuthStore.getState().logout();
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
};
