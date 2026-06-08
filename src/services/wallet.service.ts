import api from '@/lib/axios';
import type { ApiResponse, WalletData, WalletTransaction } from '@/lib/api-types';

interface WalletTransactionsResponse {
  transactions: WalletTransaction[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export const walletService = {
  getWallet: async () => {
    const response = await api.get<ApiResponse<WalletData>>('/wallets');
    return response.data;
  },

  fundWallet: async (amount: number) => {
    const response = await api.post<ApiResponse<{ reference: string }> & { access_code: string; authorization_url: string }>('/wallets/fund', { amount });
    return response.data;
  },

  getTransactions: async (params?: { page?: number; limit?: number; category?: string }) => {
    const response = await api.get<ApiResponse<WalletTransaction[]> & WalletTransactionsResponse>('/wallets/transactions', { params });
    return response.data;
  },

  payWithWallet: async (payload: { collectionId: string; amount: number; message?: string; isAnonymous?: boolean }) => {
    const response = await api.post<ApiResponse<{ contribution: unknown; walletBalance: number }>>('/wallets/pay', payload);
    return response.data;
  },
};
