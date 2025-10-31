import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Activity, ActivityType } from '../types/activity';
import { activityService } from '../services/activityService';

interface ActivityState {
  activities: Activity[];
  isLoading: boolean;
  offlineQueue: Array<{
    id: string;
    userId: string;
    activityType: ActivityType;
    title: string;
    description?: string;
    metadata?: Record<string, any>;
    pointsEarned?: number;
    timestamp: string;
  }>;

  logActivity: (
    userId: string,
    activityType: ActivityType,
    title: string,
    description?: string,
    metadata?: Record<string, any>,
    pointsEarned?: number
  ) => Promise<void>;
  loadActivities: (userId: string, limit?: number) => Promise<void>;
  processOfflineQueue: (userId: string) => Promise<void>;
  clearActivities: () => void;
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      activities: [],
      isLoading: false,
      offlineQueue: [],

      logActivity: async (userId, activityType, title, description, metadata, pointsEarned) => {
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const tempActivity: Activity = {
          id: tempId,
          user_id: userId,
          activity_type: activityType,
          title,
          description,
          metadata: metadata || {},
          points_earned: pointsEarned || 0,
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          activities: [tempActivity, ...state.activities],
        }));

        if (navigator.onLine) {
          const activity = await activityService.logActivity(
            userId,
            activityType,
            title,
            description,
            metadata,
            pointsEarned
          );

          if (activity) {
            set((state) => ({
              activities: state.activities.map((a) => (a.id === tempId ? activity : a)),
            }));
          }
        } else {
          set((state) => ({
            offlineQueue: [
              ...state.offlineQueue,
              {
                id: tempId,
                userId,
                activityType,
                title,
                description,
                metadata,
                pointsEarned,
                timestamp: new Date().toISOString(),
              },
            ],
          }));
        }
      },

      loadActivities: async (userId, limit = 50) => {
        set({ isLoading: true });

        const activities = await activityService.getUserActivities(userId, limit);

        set({
          activities,
          isLoading: false,
        });
      },

      processOfflineQueue: async (userId) => {
        const { offlineQueue } = get();

        if (offlineQueue.length === 0 || !navigator.onLine) return;

        const processedIds: string[] = [];

        for (const item of offlineQueue) {
          const activity = await activityService.logActivity(
            item.userId,
            item.activityType,
            item.title,
            item.description,
            item.metadata,
            item.pointsEarned
          );

          if (activity) {
            processedIds.push(item.id);

            set((state) => ({
              activities: state.activities.map((a) => (a.id === item.id ? activity : a)),
            }));
          }
        }

        set((state) => ({
          offlineQueue: state.offlineQueue.filter((item) => !processedIds.includes(item.id)),
        }));
      },

      clearActivities: () => {
        set({ activities: [] });
      },
    }),
    {
      name: 'activity-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        offlineQueue: state.offlineQueue,
      }),
    }
  )
);
