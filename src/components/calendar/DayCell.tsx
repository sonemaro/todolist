import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { CalendarDay } from '../../utils/dateUtils';
import { Task } from '../../types';

interface DayCellProps {
  day: CalendarDay;
  tasks: Task[];
  isSelected: boolean;
  onClick: (date: Date) => void;
  onAddTask: (date: Date) => void;
}

const DayCell: React.FC<DayCellProps> = ({
  day,
  tasks,
  isSelected,
  onClick,
  onAddTask
}) => {
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const hasOverdue = tasks.some(task => !task.completed && task.dueDate && new Date(task.dueDate) < new Date());

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(day.date)}
      className={`
        relative min-h-[100px] p-2 border border-gray-200 dark:border-gray-700 cursor-pointer
        transition-all duration-200 group
        ${day.inMonth 
          ? 'bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-gray-800' 
          : 'bg-gray-50 dark:bg-gray-900 text-gray-400'
        }
        ${isSelected ? 'ring-2 ring-pastel-mint bg-pastel-mint/5' : ''}
        ${day.isToday ? 'ring-2 ring-pastel-blue bg-pastel-blue/5' : ''}
        ${hasOverdue ? 'border-l-4 border-l-red-500' : ''}
      `}
    >
      {/* Day Number */}
      <div className="flex items-center justify-between mb-2">
        <span className={`
          text-sm font-medium
          ${day.isToday ? 'text-pastel-blue font-bold' : ''}
          ${!day.inMonth ? 'text-gray-400' : 'text-gray-900 dark:text-white'}
        `}>
          {day.dayNumber}
        </span>

        {/* Add Task Button */}
        {day.inMonth && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddTask(day.date);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-pastel-mint/20 
                     transition-all duration-200"
          >
            <Plus className="h-3 w-3 text-pastel-mint" />
          </button>
        )}
      </div>

      {/* Task Indicators */}
      {day.inMonth && tasks.length > 0 && (
        <div className="space-y-1">
          {/* Show up to 3 tasks */}
          {tasks.slice(0, 3).map((task, index) => (
            <div
              key={task.id}
              className={`
                text-xs px-2 py-1 rounded-full truncate
                ${task.completed 
                  ? 'bg-pastel-mint/20 text-pastel-mint line-through' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }
              `}
              title={task.title}
            >
              {task.title}
            </div>
          ))}

          {/* Show count if more than 3 tasks */}
          {tasks.length > 3 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              +{tasks.length - 3} more
            </div>
          )}
        </div>
      )}

      {/* Task Summary Dots */}
      {day.inMonth && tasks.length > 0 && (
        <div className="absolute bottom-2 right-2 flex space-x-1 rtl:space-x-reverse">
          {completedTasks.length > 0 && (
            <div 
              className="w-2 h-2 rounded-full bg-pastel-mint"
              title={`${completedTasks.length} completed`}
            />
          )}
          {pendingTasks.length > 0 && (
            <div 
              className="w-2 h-2 rounded-full bg-gray-400"
              title={`${pendingTasks.length} pending`}
            />
          )}
          {hasOverdue && (
            <div 
              className="w-2 h-2 rounded-full bg-red-500"
              title="Has overdue tasks"
            />
          )}
        </div>
      )}

      {/* Today Indicator */}
      {day.isToday && (
        <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-pastel-blue animate-pulse" />
      )}
    </motion.div>
  );
};

export default DayCell;