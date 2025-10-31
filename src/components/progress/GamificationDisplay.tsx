import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../stores/useAppStore';
import AnimalAnimation from './animations/AnimalAnimation';
import PlantAnimation from './animations/PlantAnimation';
import RobotAnimation from './animations/RobotAnimation';
import FantasyAnimation from './animations/FantasyAnimation';
import PointsAnimation from './animations/PointsAnimation';

interface GamificationDisplayProps {
  compact?: boolean;
}

const GamificationDisplay: React.FC<GamificationDisplayProps> = ({ compact = false }) => {
  const { preferences, stats } = useAppStore();

  const getAnimalStage = (level: number): { emoji: string; name: string } => {
    if (level >= 10) return { emoji: '🦅', name: 'Majestic Eagle' };
    if (level >= 7) return { emoji: '🐦', name: 'Bird' };
    if (level >= 4) return { emoji: '🐥', name: 'Chick' };
    if (level >= 2) return { emoji: '🐣', name: 'Hatching Egg' };
    return { emoji: '🥚', name: 'Egg' };
  };

  const getPlantStage = (level: number): { emoji: string; name: string } => {
    if (level >= 10) return { emoji: '🌳', name: 'Mighty Oak' };
    if (level >= 7) return { emoji: '🌲', name: 'Young Tree' };
    if (level >= 4) return { emoji: '🌿', name: 'Sprouting Plant' };
    if (level >= 2) return { emoji: '🌱', name: 'Seedling' };
    return { emoji: '🌰', name: 'Seed' };
  };

  const getRobotStage = (level: number): { emoji: string; name: string } => {
    if (level >= 10) return { emoji: '🤖', name: 'Advanced AI' };
    if (level >= 7) return { emoji: '🦾', name: 'Robotic Arm' };
    if (level >= 4) return { emoji: '⚙️', name: 'Mechanism' };
    if (level >= 2) return { emoji: '🔧', name: 'Basic Parts' };
    return { emoji: '🔩', name: 'Bolt' };
  };

  const getFantasyStage = (level: number): { emoji: string; name: string } => {
    if (level >= 10) return { emoji: '🐉', name: 'Ancient Dragon' };
    if (level >= 7) return { emoji: '🦎', name: 'Young Dragon' };
    if (level >= 4) return { emoji: '🦖', name: 'Dragon Hatchling' };
    if (level >= 2) return { emoji: '🥚', name: 'Dragon Egg' };
    return { emoji: '🔮', name: 'Magic Essence' };
  };

  const getGamificationContent = () => {
    const level = stats.level || 1;
    const points = stats.points || 0;
    const nextLevelPoints = level * 100;
    const progress = ((points % 100) / 100) * 100;

    switch (preferences.gamificationMode) {
      case 'animal': {
        const stage = getAnimalStage(level);
        return {
          emoji: stage.emoji,
          name: stage.name,
          description: `Level ${level} Animal`,
          progress,
          nextLevel: `${points % 100} / 100 XP to next evolution`,
        };
      }

      case 'plant': {
        const stage = getPlantStage(level);
        return {
          emoji: stage.emoji,
          name: stage.name,
          description: `Level ${level} Plant`,
          progress,
          nextLevel: `${points % 100} / 100 XP to grow`,
        };
      }

      case 'robot': {
        const stage = getRobotStage(level);
        return {
          emoji: stage.emoji,
          name: stage.name,
          description: `Level ${level} Robot`,
          progress,
          nextLevel: `${points % 100} / 100 XP to upgrade`,
        };
      }

      case 'fantasy': {
        const stage = getFantasyStage(level);
        return {
          emoji: stage.emoji,
          name: stage.name,
          description: `Level ${level} Creature`,
          progress,
          nextLevel: `${points % 100} / 100 XP to evolve`,
        };
      }

      case 'points':
        return {
          emoji: '⭐',
          name: 'Points System',
          description: `Level ${level}`,
          progress,
          nextLevel: `${points % 100} / 100 XP to level up`,
        };

      case 'none':
        return null;

      default:
        return null;
    }
  };

  const content = getGamificationContent();

  if (!content) return null;

  const renderAnimatedCharacter = (size: 'sm' | 'md' | 'lg' = 'lg') => {
    const level = stats.level || 1;
    switch (preferences.gamificationMode) {
      case 'animal':
        return <AnimalAnimation level={level} size={size} />;
      case 'plant':
        return <PlantAnimation level={level} size={size} />;
      case 'robot':
        return <RobotAnimation level={level} size={size} />;
      case 'fantasy':
        return <FantasyAnimation level={level} size={size} />;
      case 'points':
        return <PointsAnimation level={level} size={size} />;
      default:
        return <div className="text-4xl">{content.emoji}</div>;
    }
  };

  if (compact) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex items-center space-x-3 rtl:space-x-reverse bg-white dark:bg-dark-card
                   rounded-xl p-4 border border-gray-200 dark:border-dark-border"
      >
        <div className="flex items-center justify-center w-12 h-12">
          {renderAnimatedCharacter('sm')}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {content.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {content.description}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-pastel-mint/20 to-pastel-blue/20 rounded-2xl p-6
                 border border-gray-200 dark:border-dark-border"
    >
      <div className="text-center mb-4">
        <div className="flex items-center justify-center h-32 mb-3">
          {renderAnimatedCharacter('lg')}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {content.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {content.description}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {content.nextLevel}
          </span>
        </div>

        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${content.progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-pastel-mint to-pastel-blue rounded-full"
          />
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 text-center">
          <div className="bg-white dark:bg-dark-card rounded-lg p-2">
            <div className="text-lg font-bold text-pastel-mint">{stats.level}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Level</div>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-lg p-2">
            <div className="text-lg font-bold text-pastel-blue">{stats.points}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Points</div>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-lg p-2">
            <div className="text-lg font-bold text-pastel-orange">{stats.currentStreak}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Streak</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GamificationDisplay;
