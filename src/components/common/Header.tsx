import React, { useState } from 'react';
import { Menu, Settings, Bell, User, Moon, Sun, Globe, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppStore } from '../../stores/useAppStore';
import { useAuthStore } from '../../stores/authStore';
import { useRewardsStore } from '../../stores/rewardsStore';
import { useTaskStore } from '../../stores/useTaskStore';
import RewardBadge from '../rewards/RewardBadge';

const Header: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const { preferences, setTheme, setLanguage, setCurrentView, stats } = useAppStore();
  const { profile, isAuthenticated, logout } = useAuthStore();
  const { getUnclaimedRewards } = useRewardsStore();
  const { getCompletionRate } = useTaskStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const completionRate = getCompletionRate();
  const unclaimedCount = getUnclaimedRewards().length;

  const toggleTheme = () => {
    setTheme(preferences.theme === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(preferences.language === 'en' ? 'fa' : 'en');
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-colors">
            <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
          
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white font-vazir">
              {t('appTitle')}
            </h1>
            
            {completionRate > 0 && (
              <div className="flex items-center space-x-2 rtl:space-x-reverse bg-pastel-mint/10 dark:bg-pastel-mint/20 px-3 py-1 rounded-full">
                <div className="h-2 w-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-pastel-mint transition-all duration-500 ease-out"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-pastel-mint">
                  {completionRate}%
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {isAuthenticated && unclaimedCount > 0 && (
            <div className="mr-2">
              <RewardBadge />
            </div>
          )}

          <button
            onClick={toggleLanguage}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
            title={t('language')}
          >
            <Globe className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
            title={t('theme')}
          >
            {preferences.theme === 'light' ? (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          <div className="h-6 w-px bg-gray-200 dark:bg-dark-border"></div>

          {isAuthenticated ? (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.username || 'User'}
                    className="h-8 w-8 rounded-full object-cover border-2 border-pastel-mint"
                  />
                ) : (
                  <div className="h-8 w-8 bg-gradient-to-br from-pastel-mint to-pastel-blue rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-lg shadow-lg border border-gray-200 dark:border-dark-border overflow-hidden z-50"
                  >
                    <button
                      onClick={() => {
                        setCurrentView('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                    >
                      <User className="h-4 w-4" />
                      <span>{t('profile')}</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center space-x-2 rtl:space-x-reverse text-red-600 dark:text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t('logout')}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Header;