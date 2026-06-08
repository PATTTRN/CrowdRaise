import api from '@/lib/axios';
import type { ApiResponse } from '@/lib/api-types';

export const uploadService = {
  uploadImage: async (file: File): Promise<{ url: string; fileId: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<ApiResponse<{ url: string; fileId: string }>>('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};
