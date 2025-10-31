import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { useTaskStore } from '../../stores/useTaskStore';
import { formatMonthLabel, CalendarType, getToday } from '../../utils/dateUtils';
import { useTranslation } from '../../hooks/useTranslation';
import Confetti from './Confetti';
import AnimalAnimation from '../progress/animations/AnimalAnimation';
import PlantAnimation from '../progress/animations/PlantAnimation';
import RobotAnimation from '../progress/animations/RobotAnimation';
import FantasyAnimation from '../progress/animations/FantasyAnimation';
import PointsAnimation from '../progress/animations/PointsAnimation';

interface CalendarHeaderProps {
  viewDate: Date;
  calendarType: CalendarType;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  viewDate,
  calendarType,
  onPrevMonth,
  onNextMonth,
  onToday
}) => {
  const { t, language: lang, isRTL } = useTranslation();
  const { stats, preferences } = useAppStore();
  const { tasks } = useTaskStore();
  const [showConfetti, setShowConfetti] = useState(false);

  const handleToday = () => {
    onToday();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1000);
  };

  // Get month label with fallback
  const monthLabel = formatMonthLabel(viewDate, calendarType, lang) || '—';

  // Calculate gamification progress
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const level = stats.level || 1;

  const renderGamificationIcon = () => {
    if (preferences.gamificationMode === 'none') return null;

    switch (preferences.gamificationMode) {
      case 'animal':
        return <AnimalAnimation level={level} size="sm" />;
      case 'plant':
        return <PlantAnimation level={level} size="sm" />;
      case 'robot':
        return <RobotAnimation level={level} size="sm" />;
      case 'fantasy':
        return <FantasyAnimation level={level} size="sm" />;
      case 'points':
        return <PointsAnimation level={level} size="sm" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {/* Confetti Animation */}
      {showConfetti && <Confetti />}
      
      <div className="flex items-center justify-between p-4 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border">
        {/* Gamification Character */}
        {preferences.gamificationMode !== 'none' && (
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-12 h-12 flex items-center justify-center">
              {renderGamificationIcon()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <div className="font-medium">Level {level}</div>
              <div>{stats.points} pts</div>
            </div>
          </div>
        )}
        {preferences.gamificationMode === 'none' && <div className="w-12" />}

        {/* Month Navigation */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPrevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={t('previousMonth') || 'Previous month'}
          >
            {isRTL ? (
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
          </motion.button>

          <div className="min-w-[200px] text-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {monthLabel}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {calendarType === 'jalali' ? 'تقویم شمسی' : 'Gregorian Calendar'}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={t('nextMonth') || 'Next month'}
          >
            {isRTL ? (
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
          </motion.button>
        </div>

        {/* Today Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToday}
          className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 
                   bg-gradient-to-r from-pastel-mint to-pastel-blue text-white 
                   rounded-full shadow-md hover:shadow-lg transition-all duration-200
                   font-medium text-sm min-w-[44px] min-h-[44px]"
          aria-label={lang === 'fa' ? 'برو به امروز' : 'Go to today'}
        >
          <CalendarIcon className="h-4 w-4" />
          <span>{lang === 'fa' ? 'امروز' : 'Today'}</span>
        </motion.button>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-dark-border">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {lang === 'fa' ? 'پیشرفت امروز' : 'Today\'s Progress'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {completedTasks}/{totalTasks}
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-pastel-mint to-pastel-blue rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Calendar Type Toggle */}
    </div>
  );
};

export default CalendarHeader;