import React, { ReactNode } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';

interface GestureHandlerProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  className?: string;
}

const GestureHandler: React.FC<GestureHandlerProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  threshold = 100,
  className = ''
}) => {
  const [{ x, backgroundColor }, api] = useSpring(() => ({
    x: 0,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  }));

  const bind = useDrag(
    ({ active, movement: [mx], direction: [xDir], velocity, cancel }) => {
      const trigger = velocity > 0.2;
      const dir = xDir < 0 ? -1 : 1;
      
      if (!active && trigger && Math.abs(mx) > threshold) {
        // Trigger swipe action
        if (dir === -1 && onSwipeLeft) {
          onSwipeLeft();
        } else if (dir === 1 && onSwipeRight) {
          onSwipeRight();
        }
        cancel();
      }

      // Visual feedback during drag
      let bgColor = 'rgba(255, 255, 255, 1)';
      if (active && Math.abs(mx) > 50) {
        if (mx < 0 && onSwipeLeft) {
          bgColor = 'rgba(239, 68, 68, 0.1)'; // Red for delete
        } else if (mx > 0 && onSwipeRight) {
          bgColor = 'rgba(34, 197, 94, 0.1)'; // Green for complete
        }
      }

      api.start({
        x: active ? mx : 0,
        backgroundColor: bgColor,
        immediate: active,
      });
    },
    {
      axis: 'x',
      bounds: { left: -200, right: 200 },
      rubberband: true,
    }
  );

  return (
    <animated.div
      {...bind()}
      style={{
        x,
        backgroundColor,
        touchAction: 'pan-y',
      }}
      className={`select-none ${className}`}
    >
      {children}
    </animated.div>
  );
};

export default GestureHandler;