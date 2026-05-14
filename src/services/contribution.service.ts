import api from '@/lib/axios';

export const contributionService = {
  initializeContribution: async (contributionData: {
    collectionId: string;
    amount: number;
    message?: string;
    isAnonymous?: boolean;
    supporterName?: string;
    supporterEmail?: string;
    currency?: string;
  }) => {
    const response = await api.post('/contributions', contributionData);
    return response.data; // { message, data: contribution, access_code }
  },

  confirmContribution: async (contributionId: string) => {
    const response = await api.post(`/contributions/${contributionId}/confirm`);
    return response.data;
  },

  getCollectionContributions: async (collectionId: string) => {
    const response = await api.get(`/contributions/collection/${collectionId}`);
    return response.data;
  },

  getRevenueSummary: async () => {
    const response = await api.get('/contributions/admin/revenue');
    return response.data;
  },
};
