import React from 'react';
import { motion } from 'framer-motion';

interface FantasyAnimationProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
}

const FantasyAnimation: React.FC<FantasyAnimationProps> = ({ level, size = 'lg' }) => {
  const getStage = () => {
    if (level >= 10) return { emoji: '🐉', stage: 5 };
    if (level >= 7) return { emoji: '🦎', stage: 4 };
    if (level >= 4) return { emoji: '🦖', stage: 3 };
    if (level >= 2) return { emoji: '🥚', stage: 2 };
    return { emoji: '🔮', stage: 1 };
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
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
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
            rotate: [-3, 3, -3],
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
            rotate: [-5, 5, -5],
          },
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        };
      case 4:
        return {
          animate: {
            y: [0, -12, 0],
            x: [-3, 3, -3],
            rotate: [-8, 8, -8],
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        };
      case 5:
        return {
          animate: {
            y: [0, -15, 0],
            x: [-5, 5, -5],
            rotate: [-10, 10, -10],
            scale: [1, 1.05, 1],
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

      {stage.stage >= 1 && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0.3, 1, 0.3],
                x: [0, (i - 1) * 30],
                y: [0, -20 - i * 10],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeOut',
              }}
              className="absolute top-0 left-1/2 text-xl"
            >
              ✨
            </motion.div>
          ))}
        </>
      )}

      {stage.stage >= 4 && (
        <motion.div
          animate={{
            rotate: [0, 360],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-7xl opacity-20">💫</div>
        </motion.div>
      )}

      {stage.stage === 5 && (
        <>
          <motion.div
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-4 -right-4 text-2xl"
          >
            🔥
          </motion.div>
          <motion.div
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.75,
            }}
            className="absolute -bottom-4 -left-4 text-2xl"
          >
            🔥
          </motion.div>
        </>
      )}
    </div>
  );
};

export default FantasyAnimation;
