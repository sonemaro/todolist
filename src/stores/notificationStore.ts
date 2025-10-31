import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Notification, NotificationType, PrivacySettings } from '../types/activity';
import { notificationService } from '../services/notificationService';

interface NotificationState {
  notifications: Notification[];
  privacySettings: PrivacySettings | null;
  isLoading: boolean;

  createNotification: (
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    icon?: string,
    actionUrl?: string,
    metadata?: Record<string, any>
  ) => Promise<void>;
  loadNotifications: (userId: string) => Promise<void>;
  loadPrivacySettings: (userId: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  dismissNotification: (notificationId: string) => Promise<void>;
  updatePrivacySettings: (userId: string, settings: Partial<PrivacySettings>) => Promise<void>;
  getUnreadCount: () => number;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      privacySettings: null,
      isLoading: false,

      createNotification: async (userId, type, title, message, icon, actionUrl, metadata) => {
        const notification = await notificationService.createNotification(
          userId,
          type,
          title,
          message,
          icon,
          actionUrl,
          metadata
        );

        if (notification) {
          set((state) => ({
            notifications: [notification, ...state.notifications],
          }));
        }
      },

      loadNotifications: async (userId) => {
        set({ isLoading: true });

        const notifications = await notificationService.getUserNotifications(userId);

        set({
          notifications,
          isLoading: false,
        });
      },

      loadPrivacySettings: async (userId) => {
        const settings = await notificationService.getPrivacySettings(userId);

        set({ privacySettings: settings });
      },

      markAsRead: async (notificationId) => {
        const success = await notificationService.markAsRead(notificationId);

        if (success) {
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === notificationId ? { ...n, read: true } : n
            ),
          }));
        }
      },

      markAllAsRead: async (userId) => {
        const success = await notificationService.markAllAsRead(userId);

        if (success) {
          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
          }));
        }
      },

      dismissNotification: async (notificationId) => {
        const success = await notificationService.dismissNotification(notificationId);

        if (success) {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== notificationId),
          }));
        }
      },

      updatePrivacySettings: async (userId, settings) => {
        const updated = await notificationService.updatePrivacySettings(userId, settings);

        if (updated) {
          set({ privacySettings: updated });
        }
      },

      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.read && !n.dismissed).length;
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: 'notification-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        notifications: state.notifications.slice(0, 20),
      }),
    }
  )
);
