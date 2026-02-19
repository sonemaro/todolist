import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Target, 
  Zap, 
  Calendar,
  Plus,
  ArrowRight,
  Flame,
  Trophy,
  ListTodo
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useAppStore } from '../../stores/useAppStore';
import { useTaskStore } from '../../stores/useTaskStore';
import { useRewardsStore } from '../../stores/rewardsStore';
import { useActivityStore } from '../../stores/activityStore';

const DashboardPage: React.FC = () => {
  const { profile, session } = useAuthStore();
  const { stats, setCurrentView } = useAppStore();
  const { tasks, getTodayTasks, getOverdueTasks } = useTaskStore();
  const { balance } = useRewardsStore();
  const { activities } = useActivityStore();

  const todayTasks = getTodayTasks();
  const overdueTasks = getOverdueTasks();
  const completedToday = todayTasks.filter(t => t.completed).length;
  const totalToday = todayTasks.length;
  const progressToday = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  const allPending = tasks.filter(t => !t.completed);
  const completedCount = tasks.filter(t => t.completed).length;
  const completionRate = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
  
  const xpForNextLevel = stats.level * 100;
  const xpInCurrentLevel = stats.points % 100;
  const levelProgress = (xpInCurrentLevel / 100) * 100;

  const recentActivities = activities.slice(0, 5);

  return (
    <div className="min-h-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-dark-bg dark:via-dark-bg dark:to-dark-bg p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Welcome back, {profile?.username || session?.user?.email?.split('@')[0] || 'there'}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Here's what's happening with your tasks today.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('tasks')}
            className="hidden md:flex items-center gap-2 bg-pastel-mint hover:bg-pastel-mint/90 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="h-5 w-5" />
            New Task
          </button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-dark-border"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Completed</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {completedCount}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {completionRate.toFixed(0)}% completion rate
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-dark-border"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <ListTodo className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Pending</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {allPending.length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {totalToday} due today
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-dark-border"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <Flame className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-2xl">🔥</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Streak</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {stats.currentStreak}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              days in a row
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-dark-border"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-2xl">⚡</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Level</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {stats.level}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {stats.points} total XP
            </p>
          </motion.div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Today's Tasks & Progress */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Today's Progress */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-pastel-mint to-pastel-blue rounded-2xl p-6 text-white shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">Today's Progress</h3>
                  <p className="text-white/80 text-sm mt-1">
                    {completedToday} of {totalToday} tasks completed
                  </p>
                </div>
                <div className="relative w-20 h-20">
                  <svg className="transform -rotate-90 w-20 h-20">
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="white"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${progressToday * 2.01} 201`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{progressToday.toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              {overdueTasks.length > 0 && (
                <div className="mt-4 bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                  <p className="text-sm font-medium">
                    ⚠️ You have {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Today's Tasks */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-dark-border"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-pastel-mint" />
                  Today's Tasks
                </h3>
                <button
                  onClick={() => setCurrentView('tasks')}
                  className="text-sm text-pastel-mint hover:text-pastel-mint/80 font-medium flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                {todayTasks.length > 0 ? (
                  todayTasks.slice(0, 5).map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        task.completed
                          ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                          : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-pastel-mint'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${task.completed ? 'text-green-600' : 'text-gray-400'}`}>
                          {task.completed ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              task.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                              task.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                              {task.priority}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {task.category.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No tasks for today</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      You're all caught up! 🎉
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Level Progress & Activity */}
          <div className="space-y-6">
            
            {/* Level Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-dark-border"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Level Progress
                </h3>
              </div>

              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 mb-3">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{stats.level}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {xpInCurrentLevel} / {xpForNextLevel} XP
                </p>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <p className="text-2xl mb-1">🌱</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{balance.seeds}</p>
                  <p className="text-xs text-gray-500">Seeds</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                  <p className="text-2xl mb-1">🪙</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{balance.coins}</p>
                  <p className="text-xs text-gray-500">Coins</p>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <p className="text-2xl mb-1">⭐</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{balance.xp}</p>
                  <p className="text-xs text-gray-500">Bonus XP</p>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-dark-border"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-pastel-mint" />
                  Recent Activity
                </h3>
              </div>

              <div className="space-y-3">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, i) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-pastel-mint/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Target className="h-4 w-4 text-pastel-mint" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {activity.points_earned > 0 && (
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">
                          +{activity.points_earned} XP
                        </span>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <TrendingUp className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-dark-border"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Longest Streak</span>
                  <span className="font-medium text-gray-900 dark:text-white">{stats.longestStreak} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Pomodoros</span>
                  <span className="font-medium text-gray-900 dark:text-white">{stats.pomodoroCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</span>
                  <span className="font-medium text-gray-900 dark:text-white">{tasks.length}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
