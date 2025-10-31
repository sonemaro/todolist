import { PastelColor } from '../types';

export const getColorClasses = (color: PastelColor, variant: 'bg' | 'text' | 'border' | 'ring' = 'bg'): string => {
  const colorMap = {
    mint: {
      bg: 'bg-pastel-mint',
      text: 'text-pastel-mint',
      border: 'border-pastel-mint',
      ring: 'ring-pastel-mint',
    },
    lavender: {
      bg: 'bg-pastel-lavender',
      text: 'text-pastel-lavender',
      border: 'border-pastel-lavender',
      ring: 'ring-pastel-lavender',
    },
    blue: {
      bg: 'bg-pastel-blue',
      text: 'text-pastel-blue',
      border: 'border-pastel-blue',
      ring: 'ring-pastel-blue',
    },
    pink: {
      bg: 'bg-pastel-pink',
      text: 'text-pastel-pink',
      border: 'border-pastel-pink',
      ring: 'ring-pastel-pink',
    },
    yellow: {
      bg: 'bg-pastel-yellow',
      text: 'text-pastel-yellow',
      border: 'border-pastel-yellow',
      ring: 'ring-pastel-yellow',
    },
    orange: {
      bg: 'bg-pastel-orange',
      text: 'text-pastel-orange',
      border: 'border-pastel-orange',
      ring: 'ring-pastel-orange',
    },
    teal: {
      bg: 'bg-pastel-teal',
      text: 'text-pastel-teal',
      border: 'border-pastel-teal',
      ring: 'ring-pastel-teal',
    },
    purple: {
      bg: 'bg-pastel-purple',
      text: 'text-pastel-purple',
      border: 'border-pastel-purple',
      ring: 'ring-pastel-purple',
    },
  };

  return colorMap[color][variant];
};

export const getColorValue = (color: PastelColor): string => {
  const colorValues = {
    mint: '#10B981',
    lavender: '#8B5CF6',
    blue: '#3B82F6',
    pink: '#EC4899',
    yellow: '#F59E0B',
    orange: '#F97316',
    teal: '#14B8A6',
    purple: '#A855F7',
  };

  return colorValues[color];
};