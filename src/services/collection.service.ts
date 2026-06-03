import api from '@/lib/axios';
import type { ApiResponse, Collection, CreateCollectionPayload, UpdateCollectionPayload } from '@/lib/api-types';

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
    const response = await api.get<ApiResponse<Collection[]>>('/collections', { params });
    return response.data;
  },

  getCollectionById: async (collectionId: string) => {
    const response = await api.get<ApiResponse<Collection>>(`/collections/${collectionId}`);
    return response.data;
  },

  createCollection: async (collectionData: CreateCollectionPayload) => {
    const response = await api.post<ApiResponse<{ _id: string }>>('/collections', collectionData);
    return response.data;
  },

  updateCollection: async (collectionId: string, collectionData: UpdateCollectionPayload) => {
    const response = await api.patch<ApiResponse<Collection>>(`/collections/${collectionId}`, collectionData);
    return response.data;
  },

  deleteCollection: async (collectionId: string) => {
    const response = await api.delete<ApiResponse<null>>(`/collections/${collectionId}`);
    return response.data;
  },
};
