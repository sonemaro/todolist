import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Check, Trash2, Calendar as CalendarIcon, Leaf, Heart, Download, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { CareItem } from '../../types/care';
import { useCareStore } from '../../stores/useCareStore';
import { exportToICS } from '../../utils/calendarExport';
import CareTaskForm from './CareTaskForm';

interface CareItemDetailProps {
  item: CareItem;
  onClose: () => void;
}

const formatDateTime = (date: Date) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `🕒 Next: ${months[date.getMonth()]} ${date.getDate()}, ${displayHours}:${displayMinutes} ${ampm}`;
};

const CareItemDetail: React.FC<CareItemDetailProps> = ({ item, onClose }) => {
  const { getTasksByCareItem, toggleCareTask, deleteCareTask, deleteCareItem } = useCareStore();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const tasks = getTasksByCareItem(item.id).sort((a, b) =>
    a.dueDate.getTime() - b.dueDate.getTime()
  );

  const isPlant = item.type === 'plant';
  const Icon = isPlant ? Leaf : Heart;
  const themeColor = isPlant ? 'green' : 'orange';

  const handleToggleTask = (taskId: string) => {
    setCompletingTaskId(taskId);
    setTimeout(() => {
      toggleCareTask(taskId);
      setCompletingTaskId(null);
    }, 600);
  };

  const isOverdue = (task: any) => {
    return !task.completed && task.dueDate < new Date();
  };

  const handleDelete = () => {
    deleteCareItem(item.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className={`p-6 border-b border-gray-200 dark:border-dark-border ${
          isPlant ? 'bg-green-50 dark:bg-green-900/20' : 'bg-orange-50 dark:bg-orange-900/20'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 rtl:space-x-reverse flex-1">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setShowImagePreview(true)}
                  loading="lazy"
                />
              ) : (
                <div className={`w-20 h-20 rounded-xl flex items-center justify-center ${
                  isPlant ? 'bg-green-100 dark:bg-green-900/30' : 'bg-orange-100 dark:bg-orange-900/30'
                }`}>
                  <Icon className={`h-10 w-10 ${isPlant ? 'text-green-500' : 'text-orange-500'}`} />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {item.name}
                </h3>
                <span className={`
                  px-3 py-1 text-sm font-medium rounded-full capitalize
                  ${isPlant
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                  }
                `}>
                  {item.type}
                </span>
                {item.description && (
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Care Tips Section */}
        {item.careTips && item.careTips.length > 0 && (
          <div className="px-6 py-4 bg-amber-50 dark:bg-amber-900/10 border-y border-amber-100 dark:border-amber-900/30">
            <button
              onClick={() => setShowTips(!showTips)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  Care Tips ({item.careTips.length})
                </span>
              </div>
              {showTips ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            <AnimatePresence>
              {showTips && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-3 space-y-2"
                >
                  {item.careTips.map((tip, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2 rtl:space-x-reverse text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Tasks Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Care Tasks ({tasks.length})
            </h4>
            <button
              onClick={() => setShowTaskForm(true)}
              className="px-3 py-2 bg-pastel-mint text-white rounded-lg font-medium text-sm
                       hover:bg-pastel-mint/90 transition-colors flex items-center space-x-1 rtl:space-x-reverse"
            >
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </button>
          </div>

          {/* Task List */}
          <div className="space-y-2">
            <AnimatePresence>
              {tasks.map(task => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`p-4 rounded-xl border-2 transition-all relative ${
                    task.completed
                      ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                      : isOverdue(task)
                      ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10'
                      : 'border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg'
                  }`}
                >
                  {/* Completion Animation */}
                  <AnimatePresence>
                    {completingTaskId === task.id && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute inset-0 bg-green-500/20 rounded-xl flex items-center justify-center z-10"
                      >
                        <motion.div
                          initial={{ scale: 0, rotate: 0 }}
                          animate={{ scale: [0, 1.2, 1], rotate: [0, 180, 360] }}
                          transition={{ duration: 0.6 }}
                          className="bg-green-500 rounded-full p-3"
                        >
                          <Check className="h-6 w-6 text-white" />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      disabled={completingTaskId === task.id}
                      className={`
                        flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 transition-all
                        flex items-center justify-center
                        ${task.completed
                          ? `bg-${themeColor}-500 border-${themeColor}-500`
                          : 'border-gray-300 dark:border-gray-600 hover:border-pastel-mint'
                        }
                      `}
                    >
                      {task.completed && <Check className="h-3 w-3 text-white" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h5 className={`font-medium ${
                        task.completed
                          ? 'line-through text-gray-500 dark:text-gray-400'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {task.title}
                      </h5>
                      <div className="flex items-center space-x-3 rtl:space-x-reverse mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatDateTime(task.dueDate)}</span>
                        {task.repeat !== 'none' && (
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                            {task.repeat}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <button
                        onClick={() => exportToICS(
                          `${task.title} - ${item.name}`,
                          task.dueDate,
                          `Care task for ${item.name}`
                        )}
                        className="flex-shrink-0 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                        title="Add to Calendar"
                      >
                        <Download className="h-4 w-4 text-blue-500" />
                      </button>
                      <button
                        onClick={() => deleteCareTask(task.id)}
                        className="flex-shrink-0 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {tasks.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No care tasks yet. Add your first task to get started!
              </div>
            )}
          </div>

          {/* Delete Item */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-border">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Delete {item.name}
              </button>
            ) : (
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <span className="text-sm text-gray-600 dark:text-gray-400">Are you sure?</span>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <CareTaskForm
          careItemId={item.id}
          onClose={() => setShowTaskForm(false)}
        />
      )}

      {/* Image Preview Modal */}
      {showImagePreview && item.image && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => setShowImagePreview(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={item.image}
              alt={item.name}
              className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain"
              loading="lazy"
            />
            <button
              onClick={() => setShowImagePreview(false)}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CareItemDetail;
