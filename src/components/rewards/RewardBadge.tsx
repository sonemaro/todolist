import React from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import { useRewardsStore } from '../../stores/rewardsStore';
import { useTranslation } from '../../hooks/useTranslation';

const RewardBadge: React.FC = () => {
  const { t } = useTranslation();
  const { getUnclaimedRewards } = useRewardsStore();
  const unclaimedCount = getUnclaimedRewards().length;

  if (unclaimedCount === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="relative"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white
                   rounded-full p-2 shadow-lg cursor-pointer"
      >
        <Gift className="h-5 w-5" />
      </motion.div>

      {unclaimedCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-red-500 text-white
                     rounded-full w-5 h-5 flex items-center justify-center
                     text-xs font-bold"
        >
          {unclaimedCount}
        </motion.div>
      )}
    </motion.div>
  );
};

export default RewardBadge;
