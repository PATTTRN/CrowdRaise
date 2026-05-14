import api from '@/lib/axios';

export interface CollectionQueryParams {
  status?: string;
  category?: string;
  type?: string;
  search?: string;
  creator?: string;
  sort?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}

export const collectionService = {
  getAllCollections: async (params: CollectionQueryParams = {}) => {
    const response = await api.get('/collections', { params });
    return response.data;
  },

  getCollectionById: async (collectionId: string) => {
    const response = await api.get(`/collections/${collectionId}`);
    return response.data;
  },

  createCollection: async (collectionData: Record<string, unknown>) => {
    const response = await api.post('/collections', collectionData);
    return response.data;
  },

  updateCollection: async (collectionId: string, collectionData: Record<string, unknown>) => {
    const response = await api.patch(`/collections/${collectionId}`, collectionData);
    return response.data;
  },

  deleteCollection: async (collectionId: string) => {
    const response = await api.delete(`/collections/${collectionId}`);
    return response.data;
  },
};
