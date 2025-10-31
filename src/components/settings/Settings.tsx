import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Moon, Sun, Calendar, Volume2, VolumeX, Zap, Settings as SettingsIcon } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppStore } from '../../stores/useAppStore';

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const { 
    preferences, 
    stats,
    setLanguage, 
    setTheme, 
    setCalendarType, 
    toggleSound, 
    setGamificationMode 
  } = useAppStore();

  const settingSections = [
    {
      title: 'Appearance',
      settings: [
        {
          icon: Globe,
          title: t('language'),
          description: 'Change app language',
          component: (
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  preferences.language === 'en'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('fa')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  preferences.language === 'fa'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                فارسی
              </button>
            </div>
          )
        },
        {
          icon: preferences.theme === 'light' ? Sun : Moon,
          title: t('theme'),
          description: 'Switch between light and dark mode',
          component: (
            <button
              onClick={() => setTheme(preferences.theme === 'light' ? 'dark' : 'light')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  preferences.theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          )
        },
        {
          icon: Calendar,
          title: t('calendar'),
          description: 'Choose calendar system',
          component: (
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setCalendarType('gregorian')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  preferences.calendarType === 'gregorian'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Gregorian
              </button>
              <button
                onClick={() => setCalendarType('jalali')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  preferences.calendarType === 'jalali'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Jalali
              </button>
            </div>
          )
        }
      ]
    },
    {
      title: 'Audio & Notifications',
      settings: [
        {
          icon: preferences.soundEnabled ? Volume2 : VolumeX,
          title: t('sounds'),
          description: 'Enable sound notifications',
          component: (
            <button
              onClick={toggleSound}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  preferences.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          )
        }
      ]
    },
    {
      title: 'Gamification',
      settings: [
        {
          icon: Zap,
          title: 'Game Mode',
          description: 'Choose your gamification style',
          component: (
            <select
              value={preferences.gamificationMode}
              onChange={(e) => setGamificationMode(e.target.value as any)}
              className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600
                       rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-mint"
            >
              <option value="animal">🐣 Animal Evolution</option>
              <option value="plant">🌱 Plant Growth</option>
              <option value="robot">🤖 Robot Builder</option>
              <option value="fantasy">🐉 Fantasy Creature</option>
              <option value="points">⭐ Points System</option>
              <option value="none">❌ Disabled</option>
            </select>
          )
        }
      ]
    }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-white dark:bg-dark-card 
                   px-6 py-3 rounded-full shadow-lg mb-4"
        >
          <SettingsIcon className="h-6 w-6 text-pastel-blue" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('settings')}
          </h1>
        </motion.div>
      </div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 text-center shadow-lg">
          <div className="text-2xl font-bold text-pastel-mint">{stats.level}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{t('level')}</div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 text-center shadow-lg">
          <div className="text-2xl font-bold text-pastel-blue">{stats.points}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{t('points')}</div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 text-center shadow-lg">
          <div className="text-2xl font-bold text-pastel-orange">{stats.currentStreak}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{t('streak')}</div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 text-center shadow-lg">
          <div className="text-2xl font-bold text-pastel-purple">{stats.completedTasks}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
        </div>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {settingSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-dark-card rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {section.title}
              </h3>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-dark-border">
              {section.settings.map((setting, settingIndex) => (
                <div key={settingIndex} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                        <setting.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {setting.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {setting.description}
                        </p>
                      </div>
                    </div>
                    {setting.component}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Advanced Features Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-gradient-to-r from-pastel-mint/10 to-pastel-blue/10 rounded-2xl p-6 
                 border border-gray-200 dark:border-dark-border"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          🚀 Coming Soon
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 dark:text-gray-400">
            <span>🎤</span>
            <span>Voice Input (Persian & English)</span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 dark:text-gray-400">
            <span>🧠</span>
            <span>AI Smart Suggestions</span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 dark:text-gray-400">
            <span>📊</span>
            <span>Advanced Analytics</span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 dark:text-gray-400">
            <span>🌱</span>
            <span>Plant & Pet Care Systems</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;