import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3
        }}
        className="text-6xl mb-4"
      >
        {icon}
      </motion.div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
        {title}
      </h3>
      
      <p className="text-gray-500 dark:text-gray-400 text-center mb-6 max-w-sm">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="bg-pastel-mint hover:bg-pastel-mint/90 text-white px-6 py-3 rounded-xl 
                   font-medium shadow-md hover:shadow-lg transition-all duration-200"
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;