import React from 'react';
import { motion } from 'framer-motion';

interface PlantAnimationProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
}

const PlantAnimation: React.FC<PlantAnimationProps> = ({ level, size = 'lg' }) => {
  const getStage = () => {
    if (level >= 10) return { emoji: '🌳', stage: 5 };
    if (level >= 7) return { emoji: '🌲', stage: 4 };
    if (level >= 4) return { emoji: '🌿', stage: 3 };
    if (level >= 2) return { emoji: '🌱', stage: 2 };
    return { emoji: '🌰', stage: 1 };
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
            rotate: [-1, 1, -1],
          },
          transition: {
            duration: 3,
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
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        };
      case 3:
        return {
          animate: {
            rotate: [-4, 4, -4],
            y: [0, -3, 0],
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        };
      case 4:
        return {
          animate: {
            rotate: [-5, 5, -5],
            scale: [1, 1.02, 1],
          },
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        };
      case 5:
        return {
          animate: {
            rotate: [-6, 6, -6],
            scale: [1, 1.03, 1],
          },
          transition: {
            duration: 3.5,
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
          {[...Array(stage.stage - 2)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, x: -20 + i * 20, opacity: 0 }}
              animate={{
                y: [0, 40],
                x: [-20 + i * 20, -10 + i * 15],
                opacity: [0.6, 0],
                rotate: [0, 45],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.7,
                ease: 'easeOut',
              }}
              className="absolute top-0 text-xl"
            >
              🍃
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
};

export default PlantAnimation;
