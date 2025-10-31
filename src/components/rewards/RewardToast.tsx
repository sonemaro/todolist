import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Reward } from '../../types/rewards';

interface RewardToastProps {
  reward: Reward | null;
  onClose: () => void;
}

const RewardToast: React.FC<RewardToastProps> = ({ reward, onClose }) => {
  useEffect(() => {
    if (reward) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [reward, onClose]);

  const getCurrencyIcon = (currency?: string) => {
    switch (currency) {
      case 'seeds':
        return '🌱';
      case 'coins':
        return '🪙';
      case 'xp':
        return '⭐';
      case 'badge':
        return '🏆';
      default:
        return '🎁';
    }
  };

  return (
    <AnimatePresence>
      {reward && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 z-50 max-w-md"
        >
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400
                        rounded-xl shadow-2xl p-4 flex items-center space-x-4 rtl:space-x-reverse">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="text-4xl"
            >
              {getCurrencyIcon(reward.currency)}
            </motion.div>

            <div className="flex-1">
              <h3 className="text-white font-bold text-lg">
                {reward.title}
              </h3>
              {reward.description && (
                <p className="text-white/90 text-sm">
                  {reward.description}
                </p>
              )}
              {reward.amount && (
                <p className="text-white font-semibold mt-1">
                  +{reward.amount} {reward.currency}
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-white hover:text-white/80 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RewardToast;
