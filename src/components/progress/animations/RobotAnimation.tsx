import React from 'react';
import { motion } from 'framer-motion';

interface RobotAnimationProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
}

const RobotAnimation: React.FC<RobotAnimationProps> = ({ level, size = 'lg' }) => {
  const getStage = () => {
    if (level >= 10) return { emoji: '🤖', stage: 5 };
    if (level >= 7) return { emoji: '🦾', stage: 4 };
    if (level >= 4) return { emoji: '⚙️', stage: 3 };
    if (level >= 2) return { emoji: '🔧', stage: 2 };
    return { emoji: '🔩', stage: 1 };
  };

  const stage = getStage();
  const sizeClasses = {
    sm: 'text-3xl',
    md: 'text-5xl',
    lg: 'text-8xl'
  };

  const getAnimation = () => {
    switch (stage.stage) {
      case 1:
        return {
          animate: {
            rotate: [0, 360],
          },
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
          }
        };
      case 2:
        return {
          animate: {
            rotate: [0, 15, -15, 0],
            scale: [1, 1.05, 1],
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        };
      case 3:
        return {
          animate: {
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          },
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }
        };
      case 4:
        return {
          animate: {
            y: [0, -5, 0],
            rotate: [-10, 10, -10],
          },
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        };
      case 5:
        return {
          animate: {
            scale: [1, 1.05, 1],
            y: [0, -8, 0],
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        };
      default:
        return {};
    }
  };

  return (
    <div className="relative">
      <motion.div
        {...getAnimation()}
        className={sizeClasses[size]}
      >
        {stage.emoji}
      </motion.div>

      {stage.stage >= 3 && (
        <>
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5],
                x: i === 0 ? [-10, -20] : [10, 20],
                y: [-10, -20],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeOut',
              }}
              className="absolute top-0 text-xl"
            >
              ⚡
            </motion.div>
          ))}
        </>
      )}

      {stage.stage === 5 && (
        <motion.div
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 flex items-center justify-center text-6xl opacity-30"
        >
          💫
        </motion.div>
      )}
    </div>
  );
};

export default RobotAnimation;
