import { api } from './client';
import type { Notification, PaginatedResponse } from '@/types';

export const notificationsApi = {
  list: (page = 1, limit = 20) =>
    api.get<PaginatedResponse<Notification>>(`/notifications?page=${page}&limit=${limit}`),
  getUnreadCount: () =>
    api.get<{ success: boolean; data: { count: number } }>('/notifications/unread-count'),
  markRead: (id: string) =>
    api.post<{ success: boolean; data: { message: string } }>(`/notifications/${id}/read`),
  markAllRead: () =>
    api.post<{ success: boolean; data: { message: string } }>('/notifications/mark-all-read'),
};