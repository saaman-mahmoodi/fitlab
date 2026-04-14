import { create } from 'zustand';
import type { Notification } from '@/types';
import { notificationsApi } from '@/lib/api/notifications';

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: (page?: number) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  addNotification: (notification: Notification) => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async (page = 1) => {
    set({ isLoading: true });
    try {
      const response = await notificationsApi.list(page);
      set({ notifications: response.data?.items ?? [], isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await notificationsApi.getUnreadCount();
      set({ unreadCount: response.data?.count ?? 0 });
    } catch {}
  },

  markRead: async (id: string) => {
    try {
      await notificationsApi.markRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n,
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch {}
  },

  markAllRead: async () => {
    try {
      await notificationsApi.markAllRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch {}
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));