import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Heart, Calendar } from 'lucide-react';
import { CareItem } from '../../types/care';
import { useCareStore } from '../../stores/useCareStore';

interface CareItemCardProps {
  item: CareItem;
  index: number;
  onClick: () => void;
}

const CareItemCard: React.FC<CareItemCardProps> = ({ item, index, onClick }) => {
  const { getTasksByCareItem } = useCareStore();
  const tasks = getTasksByCareItem(item.id);
  const upcomingTasks = tasks.filter(t => !t.completed && t.dueDate >= new Date());
  const nextTask = upcomingTasks.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())[0];

  const isPlant = item.type === 'plant';
  const themeColor = isPlant ? 'green' : 'orange';
  const Icon = isPlant ? Leaf : Heart;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={`
        bg-white dark:bg-dark-card rounded-2xl shadow-sm hover:shadow-lg
        transition-all duration-200 cursor-pointer overflow-hidden
        border-2 border-transparent hover:border-${themeColor}-200 dark:hover:border-${themeColor}-800
        group
      `}
    >
      {/* Image or Icon */}
      <div className={`h-32 flex items-center justify-center ${
        isPlant ? 'bg-green-50 dark:bg-green-900/20' : 'bg-orange-50 dark:bg-orange-900/20'
      }`}>
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Icon className={`h-16 w-16 ${
            isPlant ? 'text-green-500' : 'text-orange-500'
          }`} />
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate flex-1">
            {item.name}
          </h3>
          <span className={`
            px-2 py-1 text-xs font-medium rounded-full capitalize
            ${isPlant
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
            }
          `}>
            {item.type}
          </span>
        </div>

        {item.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {item.description}
          </p>
        )}

        {/* Tasks Info */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1 rtl:space-x-reverse text-gray-500 dark:text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>{upcomingTasks.length} upcoming</span>
          </div>

          {nextTask && (
            <span className="text-gray-600 dark:text-gray-300 font-medium">
              Next: {new Date(nextTask.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CareItemCard;
