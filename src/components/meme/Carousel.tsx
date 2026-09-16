/**
 * 首页轮播：自动播放 + 硬切换（滑动 + 轻微缩放）+ 进度条
 */
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Meme } from '@/types';
import { cn } from '@/utils/cn';

const AUTOPLAY_MS = 4500;

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.96,
  }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
    scale: 0.96,
  }),
};

export function Carousel({ memes }: { memes: Meme[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hovering, setHovering] = useState(false);
  const count = memes.length;

  const goTo = useCallback(
    (next: number, dir = 1) => {
      if (count === 0) return;
      setDirection(dir);
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (hovering || count <= 1) return;
    const timer = window.setInterval(() => goTo(index + 1, 1), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [hovering, count, index, goTo]);

  if (count === 0) return null;

  const slide = memes[index];
  if (!slide) return null;

  return (
    <section
      aria-roledescription="轮播"
      aria-label="热门梗推荐"
      className="relative mb-8 h-[300px] overflow-hidden border-4 border-nb-black shadow-nb-lg sm:h-[360px]"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 flex items-center px-6 sm:px-12"
          style={{ background: slide.cover }}
        >
          <div className="relative z-10 max-w-[520px]">
            <span className="mb-4 inline-block -rotate-2 border-3 border-nb-black bg-nb-black px-4 py-1.5 text-[13px] font-bold text-nb-yellow">
              🔥 本周热门
            </span>
            <h2 className="nb-text-shadow mb-3 text-[28px] font-black leading-tight sm:text-[38px]">
              {slide.title}
            </h2>
            <p className="mb-5 line-clamp-2 max-w-[520px] text-sm font-medium leading-relaxed sm:text-base">
              {slide.summary}
            </p>
            <Link
              to={`/meme/${slide.id}`}
              className="inline-flex items-center gap-2 border-3 border-nb-black bg-nb-black px-6 py-3 text-sm font-bold text-nb-yellow shadow-nb transition-nb hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-nb-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-nb-none"
            >
              一探究竟 →
            </Link>
          </div>

          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-6 right-6 text-[90px] drop-shadow-[6px_6px_0_rgba(0,0,0,0.2)] sm:bottom-auto sm:right-16 sm:text-[160px]"
            animate={{ y: [0, -14, 0], rotate: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {slide.coverEmoji}
          </motion.span>
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        aria-label="上一个"
        onClick={() => goTo(index - 1, -1)}
        className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border-3 border-nb-black bg-nb-white text-2xl font-black shadow-nb transition-nb hover:-translate-x-0.5 hover:-translate-y-[calc(50%+2px)] hover:bg-nb-yellow hover:shadow-nb-lg"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="下一个"
        onClick={() => goTo(index + 1, 1)}
        className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border-3 border-nb-black bg-nb-white text-2xl font-black shadow-nb transition-nb hover:-translate-y-[calc(50%+2px)] hover:bg-nb-yellow hover:shadow-nb-lg"
      >
        ›
      </button>

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {memes.map((meme, dotIndex) => (
          <button
            key={meme.id}
            type="button"
            aria-label={`切换到第 ${dotIndex + 1} 张`}
            aria-current={dotIndex === index}
            onClick={() => goTo(dotIndex, dotIndex > index ? 1 : -1)}
            className={cn(
              'h-3 border-3 border-nb-black bg-nb-white transition-nb',
              dotIndex === index ? 'w-8 bg-nb-black' : 'w-3 hover:bg-nb-yellow',
            )}
          />
        ))}
      </div>

      {/* 进度条 */}
      <div className="absolute bottom-0 left-0 z-20 h-1.5 w-full bg-nb-white/40">
        <motion.div
          key={`${slide.id}-${hovering ? 'paused' : 'playing'}`}
          className="h-full bg-nb-black"
          initial={{ width: '0%' }}
          animate={{ width: hovering ? '0%' : '100%' }}
          transition={{ duration: hovering ? 0.2 : AUTOPLAY_MS / 1000, ease: 'linear' }}
        />
      </div>
    </section>
  );
}