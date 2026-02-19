import { Notification, NotificationType, PrivacySettings } from '../types/activity';

const STORAGE_KEY = 'todolist_notifications';

function getStoredNotifications(): Notification[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveNotifications(notifications: Notification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
}

export const notificationService = {
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    icon?: string,
    actionUrl?: string,
    metadata?: Record<string, any>,
    expiresAt?: string
  ): Promise<Notification | null> {
    const notification: Notification = {
      id: crypto.randomUUID(),
      user_id: userId,
      type,
      title,
      message,
      icon: icon || '',
      action_url: actionUrl || '',
      metadata: metadata || {},
      read: false,
      dismissed: false,
      expires_at: expiresAt || '',
      created_at: new Date().toISOString(),
    };
    const notifications = getStoredNotifications();
    notifications.unshift(notification);
    saveNotifications(notifications.slice(0, 200));
    return notification;
  },

  async getUserNotifications(userId: string, limit: number = 50): Promise<Notification[]> {
    return getStoredNotifications()
      .filter(n => n.user_id === userId && !n.dismissed)
      .slice(0, limit);
  },

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    return getStoredNotifications()
      .filter(n => n.user_id === userId && !n.read && !n.dismissed);
  },

  async markAsRead(notificationId: string): Promise<boolean> {
    const notifications = getStoredNotifications();
    const idx = notifications.findIndex(n => n.id === notificationId);
    if (idx >= 0) {
      notifications[idx].read = true;
      saveNotifications(notifications);
      return true;
    }
    return false;
  },

  async markAllAsRead(userId: string): Promise<boolean> {
    const notifications = getStoredNotifications();
    notifications.forEach(n => {
      if (n.user_id === userId) n.read = true;
    });
    saveNotifications(notifications);
    return true;
  },

  async dismissNotification(notificationId: string): Promise<boolean> {
    const notifications = getStoredNotifications();
    const idx = notifications.findIndex(n => n.id === notificationId);
    if (idx >= 0) {
      notifications[idx].dismissed = true;
      saveNotifications(notifications);
      return true;
    }
    return false;
  },

  async getPrivacySettings(_userId: string): Promise<PrivacySettings | null> {
    try {
      return JSON.parse(localStorage.getItem('privacy_settings') || 'null');
    } catch {
      return null;
    }
  },

  async updatePrivacySettings(_userId: string, settings: Partial<PrivacySettings>): Promise<PrivacySettings | null> {
    const current = await this.getPrivacySettings(_userId) || {};
    const updated = { ...current, ...settings } as PrivacySettings;
    localStorage.setItem('privacy_settings', JSON.stringify(updated));
    return updated;
  },

  async cleanupOldNotifications(): Promise<boolean> {
    const notifications = getStoredNotifications();
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const filtered = notifications.filter(n => new Date(n.created_at).getTime() > cutoff);
    saveNotifications(filtered);
    return true;
  },
};
