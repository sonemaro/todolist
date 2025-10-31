import React from 'react';
import { motion } from 'framer-motion';

export default function Confetti() {
  const pieces = Array.from({ length: 12 });

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {pieces.map((_, i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-pastelMint rounded-full absolute"
          initial={{ y: 0, opacity: 1, x: 0 }}
          animate={{
            y: 100 + Math.random() * 100,
            x: (Math.random() - 0.5) * 100,
            opacity: 0,
          }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}