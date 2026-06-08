import api from '@/lib/axios';
import type { ApiResponse } from '@/lib/api-types';

export interface NotificationItem {
  _id: string;
  user: string;
  type: string;
  title: string;
  message?: string;
  read: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export const notificationService = {
  getAll: async () => {
    const response = await api.get<{ message: string; data: { notifications: NotificationItem[]; unreadCount: number } }>('/notifications');
    return response.data.data;
  },

  markRead: async (ids: string[]) => {
    const response = await api.patch('/notifications/read', { ids });
    return response.data;
  },

  updatePrefs: async (prefs: { emailOnContribution?: boolean; emailOnWithdrawal?: boolean; emailOnCampaignUpdate?: boolean }) => {
    const response = await api.patch('/notifications/prefs', prefs);
    return response.data;
  },
};
