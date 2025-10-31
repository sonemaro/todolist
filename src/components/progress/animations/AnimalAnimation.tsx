import React from 'react';
import { motion } from 'framer-motion';

interface AnimalAnimationProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
}

const AnimalAnimation: React.FC<AnimalAnimationProps> = ({ level, size = 'lg' }) => {
  const getStage = () => {
    if (level >= 10) return { emoji: '🦅', stage: 5 };
    if (level >= 7) return { emoji: '🐦', stage: 4 };
    if (level >= 4) return { emoji: '🐥', stage: 3 };
    if (level >= 2) return { emoji: '🐣', stage: 2 };
    return { emoji: '🥚', stage: 1 };
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
            rotate: [-2, 2, -2],
            scale: [1, 1.02, 1],
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        };
      case 2:
        return {
          animate: {
            rotate: [-5, 5, -5],
            scale: [1, 1.05, 1],
          },
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        };
      case 3:
        return {
          animate: {
            y: [0, -8, 0],
            rotate: [-3, 3, -3],
          },
          transition: {
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        };
      case 4:
        return {
          animate: {
            y: [0, -12, 0],
            rotate: [-5, 5, -5],
            scale: [1, 1.05, 1],
          },
          transition: {
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        };
      case 5:
        return {
          animate: {
            y: [0, -15, 0],
            x: [-5, 5, -5],
            rotate: [-8, 8, -8],
          },
          transition: {
            duration: 2.5,
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

      {stage.stage >= 4 && (
        <>
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-2 -right-2 text-xl"
          >
            ✨
          </motion.div>
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
            className="absolute -bottom-2 -left-2 text-xl"
          >
            ✨
          </motion.div>
        </>
      )}
    </div>
  );
};

export default AnimalAnimation;
