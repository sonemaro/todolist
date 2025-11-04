import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from './stores/useAppStore';
import { useAuthStore } from './stores/authStore';
import { useTaskStore } from './stores/useTaskStore';
import { reminderService } from './services/reminderService';
import ErrorBoundary from './components/common/ErrorBoundary';
import Header from './components/common/Header';
import Navigation from './components/common/Navigation';
import TaskList from './components/task/TaskList';
import FocusMode from './components/focus/FocusMode';
import Settings from './components/settings/Settings';
import Calendar from './components/calendar/Calendar';
import DashboardStats from './components/progress/DashboardStats';
import LevelUpCelebration from './components/common/LevelUpCelebration';
import ProfilePage from './components/profile/ProfilePage';
import DashboardPage from './components/dashboard/DashboardPage';
import AuthPage from './components/auth/AuthPage';

function App() {
  const { currentView, preferences, stats, showLevelUp, setOnlineStatus, setShowLevelUp } = useAppStore();
  const { init, isLoading, isAuthenticated } = useAuthStore();
  const { tasks } = useTaskStore();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (isAuthenticated && tasks.length > 0) {
      reminderService.scheduleAllReminders(tasks);
    }
    return () => {
      reminderService.clearAllReminders();
    };
  }, [isAuthenticated, tasks]);

  useEffect(() => {
    // Initialize theme
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Initialize language direction
    document.documentElement.dir = preferences.language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = preferences.language;

    // Setup online/offline listeners
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if ('Notification' in window && Notification.permission === 'default') {
      reminderService.requestPermission().then(granted => {
        if (!granted) {
          console.warn('Notification permission not granted');
        }
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [preferences.theme, preferences.language, setOnlineStatus]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="h-full overflow-auto">
            <DashboardPage />
          </div>
        );
      case 'tasks':
        return (
          <div className="flex flex-col h-full overflow-auto">
            <div className="flex-shrink-0 p-6">
              <ErrorBoundary>
                <DashboardStats />
              </ErrorBoundary>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <TaskList />
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="p-6 h-full overflow-auto">
            <Calendar />
          </div>
        );
      case 'focus':
        return (
          <div className="h-full overflow-auto">
            <FocusMode />
          </div>
        );
      case 'profile':
        return (
          <div className="h-full overflow-auto">
            <ProfilePage />
          </div>
        );
      case 'settings':
        return (
          <div className="h-full overflow-auto">
            <Settings />
          </div>
        );
      default:
        return (
          <div className="flex-1 overflow-auto p-4">
            <TaskList />
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-mint via-pastel-blue to-pastel-lavender">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
          <p className="text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className={`min-h-screen flex flex-col overflow-auto bg-gray-50 dark:bg-dark-bg ${preferences.language === 'fa' ? 'font-vazir' : 'font-inter'}`}>
      <div className="flex flex-col md:flex-row flex-1 h-full">
        {/* Mobile Header */}
        <div className="md:hidden flex-shrink-0">
          <Header />
        </div>

        {/* Sidebar Navigation - Desktop */}
        <div className="hidden md:flex md:flex-col w-64 border-r border-gray-200 dark:border-dark-border flex-shrink-0">
          <div className="p-6 border-b border-gray-200 dark:border-dark-border flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Advanced ToDo
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Persian & English
            </p>
          </div>
          <div className="flex-1 overflow-auto">
            <Navigation />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            {renderCurrentView()}
          </AnimatePresence>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex-shrink-0">
          <Navigation />
        </div>
      </div>

      {/* Offline Status Indicator */}
      <div className="fixed top-4 right-4 z-50 pointer-events-none">
        {!navigator.onLine && (
          <div className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm pointer-events-auto">
            Offline Mode
          </div>
        )}
      </div>

      {/* Level Up Celebration */}
      <LevelUpCelebration
        show={showLevelUp}
        level={stats.level}
        onComplete={() => setShowLevelUp(false)}
      />
    </div>
  );
}

export default App;