import { Activity, ActivitySummary, ActivityType } from '../types/activity';
import { supabase } from '../lib/supabaseClient';

export const activityService = {
  async logActivity(
    userId: string,
    activityType: ActivityType,
    title: string,
    description?: string,
    metadata?: Record<string, any>,
    pointsEarned?: number
  ): Promise<Activity | null> {
    try {
      const { data, error } = await supabase
        .from('activity_history')
        .insert({
          user_id: userId,
          activity_type: activityType,
          title,
          description,
          metadata: metadata || {},
          points_earned: pointsEarned || 0,
        })
        .select()
        .single();

      if (error) throw error;

      return data as Activity;
    } catch (err) {
      console.error('Error logging activity:', err);
      return null;
    }
  },

  async getUserActivities(userId: string, limit: number = 50): Promise<Activity[]> {
    try {
      const { data, error } = await supabase
        .from('activity_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data as Activity[]) || [];
    } catch (err) {
      console.error('Error fetching activities:', err);
      return [];
    }
  },

  async getActivitySummary(userId: string, daysBack: number = 30): Promise<ActivitySummary[]> {
    try {
      const { data, error } = await supabase.rpc('get_activity_summary', {
        user_uuid: userId,
        days_back: daysBack,
      });

      if (error) throw error;

      return (data as ActivitySummary[]) || [];
    } catch (err) {
      console.error('Error fetching activity summary:', err);
      return [];
    }
  },

  async getActivitiesByType(
    userId: string,
    activityType: ActivityType,
    limit: number = 50
  ): Promise<Activity[]> {
    try {
      const { data, error } = await supabase
        .from('activity_history')
        .select('*')
        .eq('user_id', userId)
        .eq('activity_type', activityType)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data as Activity[]) || [];
    } catch (err) {
      console.error('Error fetching activities by type:', err);
      return [];
    }
  },

  async getRecentActivities(userId: string, hours: number = 24): Promise<Activity[]> {
    try {
      const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('activity_history')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', since)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data as Activity[]) || [];
    } catch (err) {
      console.error('Error fetching recent activities:', err);
      return [];
    }
  },

  async getTotalPoints(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('activity_history')
        .select('points_earned')
        .eq('user_id', userId);

      if (error) throw error;

      const total = (data || []).reduce((sum, item) => sum + (item.points_earned || 0), 0);
      return total;
    } catch (err) {
      console.error('Error fetching total points:', err);
      return 0;
    }
  },
};
