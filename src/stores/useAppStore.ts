import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserPreferences, UserStats } from '../types';

interface AppState {
  preferences: UserPreferences;
  stats: UserStats;
  currentView: 'dashboard' | 'tasks' | 'calendar' | 'focus' | 'settings' | 'profile' | 'auth';
  isOnline: boolean;
  lastSyncTime: Date | null;
  showLevelUp: boolean;

  // Actions
  setLanguage: (language: 'en' | 'fa') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setCalendarType: (type: 'gregorian' | 'jalali') => void;
  toggleSound: () => void;
  toggleFocusMode: () => void;
  setGamificationMode: (mode: UserPreferences['gamificationMode']) => void;
  setCurrentView: (view: AppState['currentView']) => void;
  updateStats: (stats: Partial<UserStats>) => void;
  incrementPoints: (points: number) => void;
  updateStreak: () => void;
  setOnlineStatus: (status: boolean) => void;
  setSyncTime: (time: Date) => void;
  setShowLevelUp: (show: boolean) => void;
}

const defaultPreferences: UserPreferences = {
  language: 'en',
  theme: 'light',
  calendarType: 'gregorian',
  soundEnabled: true,
  focusMode: false,
  gamificationMode: 'points',
};

const defaultStats: UserStats = {
  totalTasks: 0,
  completedTasks: 0,
  currentStreak: 0,
  longestStreak: 0,
  points: 0,
  level: 1,
  pomodoroCount: 0,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      preferences: defaultPreferences,
      stats: defaultStats,
      currentView: 'tasks',
      isOnline: navigator.onLine,
      lastSyncTime: null,
      showLevelUp: false,

      setLanguage: (language) => {
        set((state) => ({
          preferences: { ...state.preferences, language }
        }));
        
        // Update document direction
        document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
      },

      setTheme: (theme) => {
        set((state) => ({
          preferences: { ...state.preferences, theme }
        }));
        
        // Update document class
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      setCalendarType: (calendarType) => {
        set((state) => ({
          preferences: { ...state.preferences, calendarType }
        }));
      },

      toggleSound: () => {
        set((state) => ({
          preferences: { 
            ...state.preferences, 
            soundEnabled: !state.preferences.soundEnabled 
          }
        }));
      },

      toggleFocusMode: () => {
        set((state) => ({
          preferences: { 
            ...state.preferences, 
            focusMode: !state.preferences.focusMode 
          }
        }));
      },

      setGamificationMode: (gamificationMode) => {
        set((state) => ({
          preferences: { ...state.preferences, gamificationMode }
        }));
      },

      setCurrentView: (currentView) => set({ currentView }),

      updateStats: (statsUpdate) => {
        set((state) => ({
          stats: { ...state.stats, ...statsUpdate }
        }));
      },

      incrementPoints: (points) => {
        set((state) => {
          const newPoints = state.stats.points + points;
          const newLevel = Math.floor(newPoints / 100) + 1;
          const leveledUp = newLevel > state.stats.level;

          if (leveledUp) {
            import('../stores/rewardsStore').then(({ useRewardsStore }) => {
              useRewardsStore.getState().createLevelUpReward(newLevel);
            });
          }

          return {
            stats: {
              ...state.stats,
              points: newPoints,
              level: newLevel > state.stats.level ? newLevel : state.stats.level
            },
            showLevelUp: leveledUp
          };
        });
      },

      updateStreak: () => {
        set((state) => {
          const newStreak = state.stats.currentStreak + 1;
          const longestStreak = Math.max(newStreak, state.stats.longestStreak);

          if ([7, 14, 30, 60, 100].includes(newStreak)) {
            import('../stores/rewardsStore').then(({ useRewardsStore }) => {
              useRewardsStore.getState().createStreakBonusReward(newStreak);
            });
          }

          return {
            stats: {
              ...state.stats,
              currentStreak: newStreak,
              longestStreak
            }
          };
        });
      },

      setOnlineStatus: (isOnline) => set({ isOnline }),

      setSyncTime: (lastSyncTime) => set({ lastSyncTime }),

      setShowLevelUp: (showLevelUp) => set({ showLevelUp }),
    }),
    {
      name: 'app-storage',
      version: 1,
    }
  )
);