import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';

interface FloatingHeart {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

export function FloatingHearts() {
  const [hearts] = useState<FloatingHeart[]>(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 4,
      size: 20 + Math.random() * 20,
    })),
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ y: '110vh', opacity: 0 }}
            animate={{
              y: '-10vh',
              opacity: [0, 0.6, 0.4, 0],
              x: [
                `${heart.x}vw`,
                `${heart.x + 10}vw`,
                `${heart.x - 5}vw`,
                `${heart.x + 5}vw`,
              ],
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute"
            style={{ left: 0, width: heart.size, height: heart.size }}
          >
            <Heart
              className="w-full h-full text-rose-300 fill-rose-300"
              style={{ filter: 'blur(1px)' }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
