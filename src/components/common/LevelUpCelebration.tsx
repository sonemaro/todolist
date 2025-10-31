import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LevelUpCelebrationProps {
  show: boolean;
  level: number;
  onComplete: () => void;
}

const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({ show, level, onComplete }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400
                     rounded-3xl p-8 shadow-2xl text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 1,
                repeat: 2,
                ease: 'easeInOut',
              }}
              className="text-7xl mb-4"
            >
              🎉
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-white mb-2"
            >
              Level Up!
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl text-white font-semibold"
            >
              You reached Level {level}
            </motion.p>

            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: Math.cos((i * 360) / 20 * Math.PI / 180) * 200,
                  y: Math.sin((i * 360) / 20 * Math.PI / 180) * 200,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.05,
                  ease: 'easeOut',
                }}
                className="absolute top-1/2 left-1/2 text-3xl"
              >
                {i % 4 === 0 ? '⭐' : i % 4 === 1 ? '✨' : i % 4 === 2 ? '💫' : '🌟'}
              </motion.div>
            ))}
          </motion.div>

          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  opacity: 1,
                }}
                animate={{
                  y: window.innerHeight + 20,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: 'linear',
                }}
                className="absolute text-2xl"
              >
                🎊
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpCelebration;
