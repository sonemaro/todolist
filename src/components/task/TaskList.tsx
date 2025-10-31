import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Search, Filter, SortAsc } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTaskStore } from '../../stores/useTaskStore';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import EmptyState from '../common/EmptyState';
import QuickAddButton from './QuickAddButton';

const TaskList: React.FC = () => {
  const { t } = useTranslation();
  const { getFilteredTasks, reorderTasks, filter, setFilter } = useTaskStore();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTasks = getFilteredTasks();
  
  const { draggedIndex, handleDragStart, handleDragEnd, handleDragOver } = useDragAndDrop(
    (startIndex, endIndex) => {
      reorderTasks(startIndex, endIndex);
    }
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilter({ ...filter, search: query });
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('tasks')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </p>
          </div>
          
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-pastel-mint hover:bg-pastel-mint/90 text-white px-4 py-2 rounded-xl font-medium 
                     shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 
                     flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Plus className="h-5 w-5" />
            <span>{t('addTask')}</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-3 bg-gray-50 dark:bg-dark-card 
                       border border-gray-200 dark:border-dark-border rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-pastel-mint focus:border-transparent
                       text-gray-900 dark:text-white placeholder-gray-500"
            />
          </div>
          
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button className="px-4 py-3 bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border 
                             rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="px-4 py-3 bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border 
                             rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <SortAsc className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <EmptyState
              icon="📝"
              title={t('noTasks')}
              description={t('noTasksDesc')}
              actionLabel={t('addTask')}
              onAction={() => setShowTaskForm(true)}
            />
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  layout
                  onDragOver={(e) => handleDragOver(e, index)}
                  className="relative"
                >
                  <TaskItem
                    task={task}
                    index={index}
                    onEdit={handleEditTask}
                    isDragging={draggedIndex === index}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Add Button */}
      <QuickAddButton />

      {/* Task Form Modal */}
      <AnimatePresence>
        {showTaskForm && (
          <TaskForm
            task={editingTask}
            onClose={handleCloseForm}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;