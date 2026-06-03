import api from '@/lib/axios';
import type { ApiResponse, Contribution, InitializeContributionPayload, RevenueSummary } from '@/lib/api-types';

export const contributionService = {
  initializeContribution: async (contributionData: InitializeContributionPayload) => {
    const response = await api.post<ApiResponse<{ _id: string }> & { access_code: string }>('/contributions', contributionData);
    return response.data;
  },

  confirmContribution: async (contributionId: string) => {
    const response = await api.post<ApiResponse<Contribution>>(`/contributions/${contributionId}/confirm`);
    return response.data;
  },

  getCollectionContributions: async (collectionId: string) => {
    const response = await api.get<ApiResponse<Contribution[]>>(`/contributions/collection/${collectionId}`);
    return response.data;
  },

  getRevenueSummary: async () => {
    const response = await api.get<{ summary: RevenueSummary }>('/contributions/admin/revenue');
    return response.data;
  },
};
