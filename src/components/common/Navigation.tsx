import React from 'react';
import { Calendar, CheckSquare, Focus, Settings, Zap, Target, User, LayoutDashboard, Leaf } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppStore } from '../../stores/useAppStore';
import { useAuthStore } from '../../stores/authStore';

const Navigation: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const { currentView, setCurrentView } = useAppStore();
  const { isAuthenticated, profile } = useAuthStore();

  const navigationItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { id: 'tasks', icon: CheckSquare, label: t('tasks') },
    { id: 'calendar', icon: Calendar, label: t('calendarNav') },
    { id: 'care', icon: Leaf, label: 'Care' },
    { id: 'focus', icon: Target, label: t('focus') },
    ...(isAuthenticated ? [{ id: 'profile' as const, icon: User, label: t('profile') }] : []),
    { id: 'settings', icon: Settings, label: t('settings') },
  ] as const;

  return (
    <nav className="bg-white dark:bg-dark-bg border-t border-gray-200 dark:border-dark-border md:border-t-0 md:border-r md:border-l px-2 py-4 md:py-6">
      <div className="flex md:flex-col justify-around md:justify-start md:space-y-2 space-x-0">
        {navigationItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setCurrentView(id)}
            className={`
              flex items-center justify-center md:justify-start p-3 md:px-4 md:py-3 
              rounded-xl transition-all duration-200 min-w-[60px] md:w-full
              ${currentView === id
                ? 'bg-pastel-mint text-white shadow-lg scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card hover:text-gray-900 dark:hover:text-gray-200'
              }
            `}
          >
            <Icon className="h-6 w-6 md:h-5 md:w-5" />
            <span className="hidden md:inline-block ml-3 rtl:ml-0 rtl:mr-3 font-medium text-sm">
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;