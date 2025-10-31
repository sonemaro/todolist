import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Target, Zap } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTaskStore } from '../../stores/useTaskStore';
import { useAppStore } from '../../stores/useAppStore';
import { getTodayProgress, getWeekProgress } from '../../utils/dateHelpers';
import ProgressBar from './ProgressBar';
import GamificationDisplay from './GamificationDisplay';

const DashboardStats: React.FC = () => {
  const { t } = useTranslation();
  const { tasks, getCompletionRate, getTodayTasks, getOverdueTasks } = useTaskStore();
  const { stats, preferences } = useAppStore();
  
  const todayTasks = getTodayTasks();
  const overdueTasks = getOverdueTasks();
  const completionRate = getCompletionRate();
  const todayProgress = getTodayProgress(tasks || []);
  const weekProgress = getWeekProgress(tasks || []);

  const statCards = [
    {
      icon: CheckCircle2,
      title: t('completed'),
      value: tasks?.filter(t => t.completed).length || 0,
      total: tasks?.length || 0,
      color: 'pastel-mint',
      bgColor: 'bg-pastel-mint/10',
    },
    {
      icon: Clock,
      title: t('today'),
      value: todayTasks?.filter(t => t.completed).length || 0,
      total: todayTasks?.length || 0,
      color: 'pastel-blue',
      bgColor: 'bg-pastel-blue/10',
    },
    {
      icon: Target,
      title: t('streak'),
      value: stats?.currentStreak || 0,
      suffix: 'days',
      color: 'pastel-orange',
      bgColor: 'bg-pastel-orange/10',
    },
    {
      icon: Zap,
      title: t('points'),
      value: stats?.points || 0,
      suffix: 'pts',
      color: 'pastel-purple',
      bgColor: 'bg-pastel-purple/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Gamification Display */}
      {preferences.gamificationMode !== 'none' && (
        <GamificationDisplay compact={false} />
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bgColor} rounded-xl p-4 border border-gray-200 dark:border-dark-border`}
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`h-6 w-6 text-${stat.color}`} />
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">
                {stat.title}
              </span>
            </div>
            
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
                {stat.suffix && (
                  <span className="text-sm text-gray-500 ml-1">{stat.suffix}</span>
                )}
              </div>
              
              {stat.total !== undefined && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  of {stat.total} tasks
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('dailyProgress')}
          </h3>
          <ProgressBar
            progress={todayProgress}
            color="pastel-mint"
            size="lg"
            label={`${todayTasks.filter(t => t.completed).length} / ${todayTasks.length} tasks`}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('weeklyProgress')}
          </h3>
          <ProgressBar
            progress={weekProgress}
            color="pastel-blue"
            size="lg"
            label="This week's completion"
          />
        </motion.div>
      </div>

      {/* Overdue Tasks Alert */}
      {overdueTasks && overdueTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="bg-red-100 dark:bg-red-800 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h4 className="font-medium text-red-800 dark:text-red-200">
                {overdueTasks.length} {t('overdue')} {overdueTasks.length === 1 ? 'Task' : 'Tasks'}
              </h4>
              <p className="text-sm text-red-600 dark:text-red-300">
                Complete these tasks to stay on track
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardStats;