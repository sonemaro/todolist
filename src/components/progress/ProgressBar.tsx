import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  color = 'pastel-mint',
  size = 'md',
  showPercentage = true,
  label 
}) => {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
          {showPercentage && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(progress)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full bg-${color} rounded-full relative`}
          style={{
            background: `linear-gradient(90deg, var(--tw-gradient-from), var(--tw-gradient-to))`
          }}
        >
          {/* Shimmer effect */}
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressBar;