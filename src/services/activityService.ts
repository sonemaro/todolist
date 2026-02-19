import { Activity, ActivitySummary, ActivityType } from '../types/activity';

const STORAGE_KEY = 'todolist_activities';

function getStoredActivities(): Activity[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveActivities(activities: Activity[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
}

export const activityService = {
  async logActivity(
    userId: string,
    activityType: ActivityType,
    title: string,
    description?: string,
    metadata?: Record<string, any>,
    pointsEarned?: number
  ): Promise<Activity | null> {
    const activity: Activity = {
      id: crypto.randomUUID(),
      user_id: userId,
      activity_type: activityType,
      title,
      description: description || '',
      metadata: metadata || {},
      points_earned: pointsEarned || 0,
      created_at: new Date().toISOString(),
    };
    const activities = getStoredActivities();
    activities.unshift(activity);
    saveActivities(activities.slice(0, 500));
    return activity;
  },

  async getUserActivities(userId: string, limit: number = 50): Promise<Activity[]> {
    return getStoredActivities().filter(a => a.user_id === userId).slice(0, limit);
  },

  async getActivitySummary(_userId: string, _daysBack: number = 30): Promise<ActivitySummary[]> {
    return [];
  },

  async getActivitiesByType(userId: string, activityType: ActivityType, limit: number = 50): Promise<Activity[]> {
    return getStoredActivities()
      .filter(a => a.user_id === userId && a.activity_type === activityType)
      .slice(0, limit);
  },

  async getRecentActivities(userId: string, hours: number = 24): Promise<Activity[]> {
    const since = Date.now() - hours * 60 * 60 * 1000;
    return getStoredActivities()
      .filter(a => a.user_id === userId && new Date(a.created_at).getTime() > since);
  },

  async getTotalPoints(userId: string): Promise<number> {
    return getStoredActivities()
      .filter(a => a.user_id === userId)
      .reduce((sum, a) => sum + (a.points_earned || 0), 0);
  },
};
