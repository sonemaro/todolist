import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, BarChart3, Calendar, CheckCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCareStore } from '../../stores/useCareStore';

interface CareReportsProps {
  onClose: () => void;
}

const CareReports: React.FC<CareReportsProps> = ({ onClose }) => {
  const { careItems, careTasks } = useCareStore();

  const stats = useMemo(() => {
    const completedTasks = careTasks.filter(t => t.completed).length;
    const pendingTasks = careTasks.filter(t => !t.completed).length;
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const upcomingTasks = careTasks
      .filter(t => !t.completed && t.dueDate >= now && t.dueDate <= nextWeek)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

    const chartData = [
      { name: 'Completed', value: completedTasks, fill: '#10b981' },
      { name: 'Pending', value: pendingTasks, fill: '#f59e0b' }
    ];

    return { completedTasks, pendingTasks, upcomingTasks, chartData };
  }, [careTasks]);

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
  };

  const getCareItemName = (taskId: string) => {
    const task = careTasks.find(t => t.id === taskId);
    if (!task) return '';
    const item = careItems.find(i => i.id === task.careItemId);
    return item?.name || '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-border">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <BarChart3 className="h-6 w-6 text-pastel-mint" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Care Reports</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Total Items</span>
              </div>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{careItems.length}</div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Completed</span>
              </div>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.completedTasks}</div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium text-orange-700 dark:text-orange-400">Pending</span>
              </div>
              <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">{stats.pendingTasks}</div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tasks Overview</h4>
            {stats.chartData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No task data available yet
              </div>
            )}
          </div>

          {/* Upcoming Tasks */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Upcoming Tasks (Next 7 Days)
            </h4>
            {stats.upcomingTasks.length > 0 ? (
              <div className="space-y-2">
                {stats.upcomingTasks.map(task => {
                  const itemName = getCareItemName(task.id);
                  return (
                    <div
                      key={task.id}
                      className="bg-white dark:bg-dark-bg rounded-lg p-4 border border-gray-200 dark:border-dark-border"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 dark:text-white">{task.title}</h5>
                          {itemName && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {itemName}
                            </p>
                          )}
                        </div>
                        <span className="text-sm font-medium text-pastel-mint px-2 py-1 bg-pastel-mint/10 rounded-full">
                          {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-dark-bg rounded-lg">
                No upcoming tasks in the next 7 days
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-dark-border">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-pastel-mint text-white rounded-xl font-medium
                     hover:bg-pastel-mint/90 transition-colors shadow-md hover:shadow-lg"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CareReports;
