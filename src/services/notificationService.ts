import { Notification, NotificationType, PrivacySettings } from '../types/activity';
import { supabase } from '../lib/supabaseClient';

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
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          icon,
          action_url: actionUrl,
          metadata: metadata || {},
          expires_at: expiresAt,
        })
        .select()
        .single();

      if (error) throw error;

      return data as Notification;
    } catch (err) {
      console.error('Error creating notification:', err);
      return null;
    }
  },

  async getUserNotifications(userId: string, limit: number = 50): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('dismissed', false)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data as Notification[]) || [];
    } catch (err) {
      console.error('Error fetching notifications:', err);
      return [];
    }
  },

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('read', false)
        .eq('dismissed', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data as Notification[]) || [];
    } catch (err) {
      console.error('Error fetching unread notifications:', err);
      return [];
    }
  },

  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      return !error;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return false;
    }
  },

  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      return !error;
    } catch (err) {
      console.error('Error marking all as read:', err);
      return false;
    }
  },

  async dismissNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ dismissed: true })
        .eq('id', notificationId);

      return !error;
    } catch (err) {
      console.error('Error dismissing notification:', err);
      return false;
    }
  },

  async getPrivacySettings(userId: string): Promise<PrivacySettings | null> {
    try {
      const { data, error } = await supabase
        .from('user_privacy_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      return data as PrivacySettings | null;
    } catch (err) {
      console.error('Error fetching privacy settings:', err);
      return null;
    }
  },

  async updatePrivacySettings(
    userId: string,
    settings: Partial<PrivacySettings>
  ): Promise<PrivacySettings | null> {
    try {
      const { data, error } = await supabase
        .from('user_privacy_settings')
        .upsert({
          user_id: userId,
          ...settings,
        })
        .select()
        .single();

      if (error) throw error;

      return data as PrivacySettings;
    } catch (err) {
      console.error('Error updating privacy settings:', err);
      return null;
    }
  },

  async cleanupOldNotifications(): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('cleanup_old_notifications');
      return !error;
    } catch (err) {
      console.error('Error cleaning up notifications:', err);
      return false;
    }
  },
};
