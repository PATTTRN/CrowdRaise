import api from '@/lib/axios';
import type { ApiResponse } from '@/lib/api-types';

export interface ExploreCollection {
  _id: string;
  type: 'fundraiser' | 'occasion' | 'tips';
  title: string;
  category: string;
  description: string;
  creator: { _id: string; name: string; email: string };
  location?: string;
  goal: number;
  raised: number;
  supporters: number;
  daysLeft: number;
  primaryImage?: { url: string };
  images: { url: string }[];
  status: string;
  eventDate?: string;
  featured?: boolean;
  createdAt: string;
  creatorTrust: {
    completedCampaigns: number;
    totalRaised: number;
    isVerified: boolean;
  };
}

export interface PaginatedResponse<T> {
  message: string;
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: T[];
}

export const exploreService = {
  getFeatured: async () => {
    const response = await api.get<ApiResponse<ExploreCollection[]>>('/collections/featured');
    return response.data;
  },

  getTrending: async () => {
    const response = await api.get<ApiResponse<ExploreCollection[]>>('/collections/trending');
    return response.data;
  },

  getAlmostFunded: async () => {
    const response = await api.get<ApiResponse<ExploreCollection[]>>('/collections/almost-funded');
    return response.data;
  },

  getAll: async (params: Record<string, string | number | undefined>) => {
    const filtered = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== ''));
    const response = await api.get<PaginatedResponse<ExploreCollection>>('/collections', { params: filtered });
    return response.data;
  },
};
