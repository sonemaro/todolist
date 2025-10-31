import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CreditCard as Edit2, Trash2, Clock, Flag, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { Task } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { useTaskStore } from '../../stores/useTaskStore';
import { useAppStore } from '../../stores/useAppStore';
import { useRewardsStore } from '../../stores/rewardsStore';
import { getColorClasses } from '../../utils/colorHelpers';
import { formatDateRelative } from '../../utils/dateHelpers';
import GestureHandler from '../common/GestureHandler';

interface TaskItemProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  isDragging?: boolean;
  onDragStart?: (index: number) => void;
  onDragEnd?: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  index, 
  onEdit, 
  isDragging = false,
  onDragStart,
  onDragEnd 
}) => {
  const { t, language } = useTranslation();
  const { toggleTask, deleteTask } = useTaskStore();
  const { incrementPoints } = useAppStore();
  const { createTaskCompletionReward } = useRewardsStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleToggleComplete = async () => {
    if (!task.completed) {
      setIsCompleting(true);
      setTimeout(() => {
        toggleTask(task.id);
        const pointsEarned = task.priority === 'urgent' ? 20 : task.priority === 'high' ? 15 : task.priority === 'medium' ? 10 : 5;
        incrementPoints(pointsEarned);
        createTaskCompletionReward(task.priority);
        setIsCompleting(false);
      }, 300);
    } else {
      toggleTask(task.id);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <GestureHandler
      onSwipeLeft={() => deleteTask(task.id)}
      onSwipeRight={() => toggleTask(task.id)}
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragStart={() => onDragStart?.(index)}
        onDragEnd={onDragEnd}
        className={`
          group bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border 
          shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden
          ${isDragging ? 'rotate-2 scale-105 shadow-lg' : ''}
          ${task.completed ? 'opacity-75' : ''}
          ${isOverdue ? 'border-l-4 border-l-red-500' : ''}
        `}
      >
        {/* Completion Animation Overlay */}
        <AnimatePresence>
          {isCompleting && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 bg-pastel-mint/20 flex items-center justify-center z-10 rounded-xl"
            >
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: [0, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 0.6 }}
                className="bg-pastel-mint rounded-full p-3"
              >
                <Check className="h-6 w-6 text-white" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4">
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            {/* Checkbox */}
            <button
              onClick={handleToggleComplete}
              disabled={isCompleting}
              className={`
                flex-shrink-0 mt-1 w-6 h-6 rounded-full border-2 transition-all duration-200 
                flex items-center justify-center
                ${task.completed 
                  ? `${getColorClasses(task.category.color, 'bg')} ${getColorClasses(task.category.color, 'border')} shadow-md` 
                  : 'border-gray-300 dark:border-gray-600 hover:border-pastel-mint'
                }
                ${isCompleting ? 'animate-pulse' : ''}
              `}
            >
              {task.completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  <Check className="h-4 w-4 text-white" />
                </motion.div>
              )}
            </button>

            {/* Task Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`
                  font-medium text-gray-900 dark:text-white truncate
                  ${task.completed ? 'line-through text-gray-500' : ''}
                `}>
                  {task.title}
                </h3>
                
                <div className="flex items-center space-x-1 rtl:space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(task)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                  >
                    <Edit2 className="h-4 w-4 text-gray-400 hover:text-pastel-blue" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </div>

              {/* Task Meta */}
              <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500 dark:text-gray-400">
                {/* Category */}
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <span className="text-xs">{task.category.icon}</span>
                  <span>{task.category.name}</span>
                </div>

                {/* Priority */}
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <Flag className={`h-3 w-3 ${getPriorityColor(task.priority)}`} />
                  <span className="capitalize">{t(task.priority)}</span>
                </div>

                {/* Due Date */}
                {task.dueDate && (
                  <div className={`flex items-center space-x-1 rtl:space-x-reverse ${isOverdue ? 'text-red-500' : ''}`}>
                    <Clock className="h-3 w-3" />
                    <span>{formatDateRelative(task.dueDate, language)}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {task.tags.length > 0 && (
                <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                  <Tag className="h-3 w-3 text-gray-400" />
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Expandable Description */}
              {task.description && (
                <div className="mt-2">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center space-x-1 rtl:space-x-reverse text-sm text-pastel-blue hover:text-pastel-blue/80"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    <span>{isExpanded ? 'Less' : 'More'}</span>
                  </button>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {task.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </GestureHandler>
  );
};

export default TaskItem;