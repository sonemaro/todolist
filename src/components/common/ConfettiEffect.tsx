import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiEffectProps {
  show: boolean;
  onComplete?: () => void;
}

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ show, onComplete }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  useEffect(() => {
    if (show) {
      const colors = ['#A7F3D0', '#DDD6FE', '#BFDBFE', '#FBCFE8', '#FEF3C7', '#FED7AA'];
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));
      
      setParticles(newParticles);
      
      // Clear particles after animation
      setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 3000);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{
                x: particle.x,
                y: particle.y,
                scale: 0,
                rotate: 0,
                opacity: 1
              }}
              animate={{
                y: window.innerHeight + 100,
                scale: [0, 1, 0.8, 0],
                rotate: [0, 180, 360, 540],
                opacity: [1, 1, 0.8, 0]
              }}
              transition={{
                duration: 3,
                ease: "easeOut",
                times: [0, 0.1, 0.8, 1]
              }}
              className="absolute w-3 h-3 rounded-full"
              style={{ backgroundColor: particle.color }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfettiEffect;