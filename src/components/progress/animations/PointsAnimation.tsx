import React from 'react';
import { motion } from 'framer-motion';

interface PointsAnimationProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
}

const PointsAnimation: React.FC<PointsAnimationProps> = ({ level, size = 'lg' }) => {
  const sizeClasses = {
    sm: 'text-3xl',
    md: 'text-5xl',
    lg: 'text-8xl'
  };

  const starCount = Math.min(level, 5);

  return (
    <div className="relative">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={sizeClasses[size]}
      >
        ⭐
      </motion.div>

      {[...Array(starCount)].map((_, i) => {
        const angle = (360 / starCount) * i;
        const radius = size === 'sm' ? 30 : size === 'md' ? 40 : 60;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={i}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
              x: [0, x],
              y: [0, y],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
            className="absolute top-1/2 left-1/2 text-xl"
            style={{ transformOrigin: 'center' }}
          >
            ✨
          </motion.div>
        );
      })}

      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.5, 0.2],
          rotate: [0, -360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="text-6xl opacity-30">💫</div>
      </motion.div>
    </div>
  );
};

export default PointsAnimation;
