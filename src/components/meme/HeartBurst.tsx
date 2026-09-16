/**
 * 点赞爱心爆炸粒子
 */
import { motion } from 'framer-motion';

const PARTICLES = [
  { x: -26, y: -26, rotate: -30, delay: 0 },
  { x: 26, y: -26, rotate: 30, delay: 0.02 },
  { x: -34, y: 4, rotate: -15, delay: 0.04 },
  { x: 34, y: 4, rotate: 15, delay: 0.06 },
  { x: 0, y: -36, rotate: 0, delay: 0.08 },
  { x: 0, y: 26, rotate: 12, delay: 0.1 },
];

export function HeartBurst({ burstKey }: { burstKey: number }) {
  if (burstKey === 0) return null;

  return (
    <span key={burstKey} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {PARTICLES.map((particle, index) => (
        <motion.span
          key={index}
          className="absolute left-1/2 top-1/2 text-xs"
          initial={{ opacity: 1, x: '-50%', y: '-50%', scale: 0.6 }}
          animate={{
            opacity: [1, 1, 0],
            x: `calc(-50% + ${particle.x}px)`,
            y: `calc(-50% + ${particle.y}px)`,
            scale: [0.6, 1.15, 0.9],
            rotate: particle.rotate,
          }}
          transition={{ duration: 0.65, delay: particle.delay, ease: 'easeOut' }}
        >
          {index % 2 === 0 ? '❤️' : '✨'}
        </motion.span>
      ))}
    </span>
  );
}