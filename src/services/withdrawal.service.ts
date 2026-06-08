import api from '@/lib/axios';
import type { ApiResponse, Bank, SaveBankDetailsPayload, Balance, Withdrawal } from '@/lib/api-types';

export const withdrawalService = {
  getBanks: async () => {
    const response = await api.get<ApiResponse<Bank[]>>('/withdrawals/banks');
    return response.data;
  },

  verifyAccount: async (accountNumber: string, bankCode: string) => {
    const response = await api.post<ApiResponse<{ accountName: string }>>('/withdrawals/verify-account', { accountNumber, bankCode });
    return response.data;
  },

  saveBankDetails: async (details: SaveBankDetailsPayload) => {
    const response = await api.put<ApiResponse<unknown>>('/withdrawals/bank-details', details);
    return response.data;
  },

  getBalance: async () => {
    const response = await api.get<ApiResponse<Balance>>('/withdrawals/balance');
    return response.data;
  },

  requestWithdrawal: async (amount: number) => {
    const response = await api.post<ApiResponse<Withdrawal>>('/withdrawals/request', { amount });
    return response.data;
  },

  getMyWithdrawals: async (page = 1) => {
    const response = await api.get<ApiResponse<Withdrawal[]>>('/withdrawals/my', { params: { page, limit: 20 } });
    return response.data;
  },

  adminGetAll: async (status?: string, page = 1) => {
    const response = await api.get<ApiResponse<Withdrawal[]>>('/withdrawals/admin/all', { params: { status, page, limit: 20 } });
    return response.data;
  },

  adminApprove: async (id: string) => {
    const response = await api.patch<ApiResponse<Withdrawal>>(`/withdrawals/${id}/approve`);
    return response.data;
  },

  adminReject: async (id: string, reason: string) => {
    const response = await api.patch<ApiResponse<Withdrawal>>(`/withdrawals/${id}/reject`, { reason });
    return response.data;
  },

  adminComplete: async (id: string) => {
    const response = await api.patch<ApiResponse<Withdrawal>>(`/withdrawals/${id}/complete`);
    return response.data;
  },
};
