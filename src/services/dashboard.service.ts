import api from '@/lib/axios';
import type { ApiResponse } from '@/lib/api-types';
import type { DashboardSummary, Transaction, EarningsBreakdown } from '@/lib/api-types';

export const dashboardService = {
  getSummary: async () => {
    const response = await api.get<ApiResponse<DashboardSummary>>('/dashboard/summary');
    return response.data;
  },

  getEarnings: async (collectionId?: string) => {
    const params = collectionId ? { collectionId } : {};
    const response = await api.get<ApiResponse<EarningsBreakdown | EarningsBreakdown[]>>('/dashboard/earnings', { params });
    return response.data;
  },

  getTransactions: async (params?: { page?: number; limit?: number; type?: string; from?: string; to?: string }) => {
    const response = await api.get<ApiResponse<Transaction[]> & { pagination: { page: number; limit: number; total: number; totalPages: number } }>('/dashboard/transactions', { params });
    return response.data;
  },

  getAnalytics: async (period?: 'day' | 'week' | 'month') => {
    const response = await api.get<ApiResponse<{ contributionsOverTime: { _id: string; amount: number; count: number; fees: number }[]; topCollections: { _id: string; title: string; raised: number; goal: number; supporters: number; status: string }[] }>>('/dashboard/analytics', { params: { period } });
    return response.data;
  },

  exportTransactions: async () => {
    const response = await api.get('/dashboard/export/transactions', { responseType: 'blob' });
    return response.data;
  },
};
