import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Target, Zap, Award, Lock } from 'lucide-react';
import { useRewardsStore } from '../../stores/rewardsStore';
import { useAppStore } from '../../stores/useAppStore';
import { useTaskStore } from '../../stores/useTaskStore';
import { useTranslation } from '../../hooks/useTranslation';

interface Achievement {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

const AchievementList: React.FC = () => {
  const { t } = useTranslation();
  const { balance, rewardedTaskIds } = useRewardsStore();
  const { stats } = useAppStore();
  const { tasks } = useTaskStore();

  // Use the greater of rewardedTaskIds (lifetime, persisted) or current completed tasks
  const currentCompleted = tasks.filter(t => t.completed).length;
  const lifetimeCompleted = Math.max(rewardedTaskIds.length, currentCompleted);

  const achievements: Achievement[] = [
    {
      id: 'first-task',
      icon: <Star className="h-6 w-6" />,
      title: 'First Steps',
      description: 'Complete your first task',
      unlocked: lifetimeCompleted >= 1,
    },
    {
      id: 'task-master-10',
      icon: <Target className="h-6 w-6" />,
      title: 'Task Master',
      description: 'Complete 10 tasks',
      unlocked: lifetimeCompleted >= 10,
      progress: lifetimeCompleted,
      maxProgress: 10,
    },
    {
      id: 'task-legend-50',
      icon: <Trophy className="h-6 w-6" />,
      title: 'Task Legend',
      description: 'Complete 50 tasks',
      unlocked: lifetimeCompleted >= 50,
      progress: Math.min(lifetimeCompleted, 50),
      maxProgress: 50,
    },
    {
      id: 'level-5',
      icon: <Zap className="h-6 w-6" />,
      title: 'Rising Star',
      description: 'Reach level 5',
      unlocked: stats.level >= 5,
      progress: stats.level,
      maxProgress: 5,
    },
    {
      id: 'level-10',
      icon: <Award className="h-6 w-6" />,
      title: 'Expert',
      description: 'Reach level 10',
      unlocked: stats.level >= 10,
      progress: Math.min(stats.level, 10),
      maxProgress: 10,
    },
    {
      id: 'streak-7',
      icon: <Target className="h-6 w-6" />,
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      unlocked: stats.longestStreak >= 7,
      progress: Math.min(stats.currentStreak, 7),
      maxProgress: 7,
    },
    {
      id: 'streak-30',
      icon: <Trophy className="h-6 w-6" />,
      title: 'Month Master',
      description: 'Maintain a 30-day streak',
      unlocked: stats.longestStreak >= 30,
      progress: Math.min(stats.currentStreak, 30),
      maxProgress: 30,
    },
    {
      id: 'collector-100-seeds',
      icon: <Star className="h-6 w-6" />,
      title: 'Seed Collector',
      description: 'Collect 100 seeds',
      unlocked: balance.seeds >= 100,
      progress: Math.min(balance.seeds, 100),
      maxProgress: 100,
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {unlockedCount} / {achievements.length} {t('badges')}
        </h3>
        <div className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {Math.round((unlockedCount / achievements.length) * 100)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-xl border-2 transition-all ${
              achievement.unlocked
                ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-700'
                : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <div
                className={`p-3 rounded-lg ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                }`}
              >
                {achievement.unlocked ? achievement.icon : <Lock className="h-6 w-6" />}
              </div>

              <div className="flex-1">
                <h4
                  className={`font-semibold mb-1 ${
                    achievement.unlocked
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {achievement.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {achievement.description}
                </p>

                {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress !== undefined && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                        }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-pastel-mint to-pastel-blue"
                      />
                    </div>
                  </div>
                )}

                {achievement.unlocked && (
                  <div className="flex items-center space-x-1 mt-2">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                      Unlocked!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AchievementList;
