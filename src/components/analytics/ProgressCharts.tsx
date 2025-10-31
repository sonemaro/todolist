import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Calendar, Award } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuthStore } from '../../stores/authStore';
import { activityService } from '../../services/activityService';
import { ActivitySummary } from '../../types/activity';

interface ChartTab {
  id: 'daily' | 'weekly' | 'monthly';
  label: string;
}

const ProgressCharts: React.FC = () => {
  const { t } = useTranslation();
  const { session } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chartData, setChartData] = useState<ActivitySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const tabs: ChartTab[] = [
    { id: 'daily', label: t('dailyProgress') },
    { id: 'weekly', label: t('weeklyProgress') },
    { id: 'monthly', label: 'Monthly Progress' },
  ];

  useEffect(() => {
    if (session) {
      loadChartData();
    }
  }, [session, activeTab]);

  const loadChartData = async () => {
    if (!session) return;

    setIsLoading(true);

    const daysBack = activeTab === 'daily' ? 7 : activeTab === 'weekly' ? 30 : 90;
    const data = await activityService.getActivitySummary(session.user.id, daysBack);

    setChartData(data);
    setIsLoading(false);
  };

  const processChartData = () => {
    if (activeTab === 'daily') {
      return chartData.slice(0, 7).reverse().map((item) => ({
        date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
        tasks: Number(item.task_completions),
        points: Number(item.points_total),
      }));
    } else if (activeTab === 'weekly') {
      const weeklyData: { [key: string]: { tasks: number; points: number } } = {};

      chartData.forEach((item) => {
        const date = new Date(item.date);
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
        const weekKey = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = { tasks: 0, points: 0 };
        }

        weeklyData[weekKey].tasks += Number(item.task_completions);
        weeklyData[weekKey].points += Number(item.points_total);
      });

      return Object.entries(weeklyData)
        .slice(0, 4)
        .map(([date, data]) => ({
          date,
          tasks: data.tasks,
          points: data.points,
        }));
    } else {
      const monthlyData: { [key: string]: { tasks: number; points: number } } = {};

      chartData.forEach((item) => {
        const monthKey = new Date(item.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
        });

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { tasks: 0, points: 0 };
        }

        monthlyData[monthKey].tasks += Number(item.task_completions);
        monthlyData[monthKey].points += Number(item.points_total);
      });

      return Object.entries(monthlyData)
        .slice(0, 3)
        .map(([date, data]) => ({
          date,
          tasks: data.tasks,
          points: data.points,
        }));
    }
  };

  const data = processChartData();

  const totalTasks = data.reduce((sum, item) => sum + item.tasks, 0);
  const totalPoints = data.reduce((sum, item) => sum + item.points, 0);
  const avgTasksPerPeriod = data.length > 0 ? Math.round(totalTasks / data.length) : 0;

  if (!session) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Please log in to view progress charts
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Progress Analytics
        </h3>
      </div>

      <div className="flex space-x-2 rtl:space-x-reverse bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-dark-card text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400">Total Tasks</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalTasks}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400">Total Points</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{totalPoints}</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400">Average</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {avgTasksPerPeriod}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-pastel-mint border-t-transparent rounded-full" />
        </div>
      ) : data.length > 0 ? (
        <div className="space-y-6">
          <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Tasks Completed
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="tasks" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Points Earned
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="points"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No activity data available for the selected period
        </div>
      )}
    </div>
  );
};

export default ProgressCharts;
