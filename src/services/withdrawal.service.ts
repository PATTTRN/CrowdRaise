import api from '@/lib/axios';

export const withdrawalService = {
  // List Nigerian banks for the dropdown
  getBanks: async () => {
    const response = await api.get('/withdrawals/banks');
    return response.data; // { data: Bank[] }
  },

  // Verify a bank account number — returns { accountName }
  verifyAccount: async (accountNumber: string, bankCode: string) => {
    const response = await api.post('/withdrawals/verify-account', { accountNumber, bankCode });
    return response.data;
  },

  // Save (or update) the creator's bank details on their profile
  saveBankDetails: async (details: {
    accountNumber: string;
    bankCode: string;
    accountName: string;
    bankName: string;
  }) => {
    const response = await api.put('/withdrawals/bank-details', details);
    return response.data;
  },

  // Get the creator's balance breakdown
  getBalance: async () => {
    const response = await api.get('/withdrawals/balance');
    return response.data; // { totalEarned, totalPaid, pendingAmount, available }
  },

  // Submit a withdrawal request
  requestWithdrawal: async (amount: number) => {
    const response = await api.post('/withdrawals/request', { amount });
    return response.data;
  },

  // Get the creator's withdrawal history
  getMyWithdrawals: async () => {
    const response = await api.get('/withdrawals/my');
    return response.data; // { count, data: Withdrawal[] }
  },

  // ── Admin ──────────────────────────────────────────────────────────────────
  adminGetAll: async (status?: string) => {
    const params = status ? `?status=${status}` : '';
    const response = await api.get(`/withdrawals/admin/all${params}`);
    return response.data;
  },

  adminApprove: async (id: string) => {
    const response = await api.patch(`/withdrawals/${id}/approve`);
    return response.data;
  },

  adminReject: async (id: string, reason: string) => {
    const response = await api.patch(`/withdrawals/${id}/reject`, { reason });
    return response.data;
  },

  adminComplete: async (id: string) => {
    const response = await api.patch(`/withdrawals/${id}/complete`);
    return response.data;
  },
};
