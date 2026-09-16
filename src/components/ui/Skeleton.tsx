/**
 * 骨架屏：黑边 + 斜条纹动画，保持 NeoBrutalism 风格
 */
import { cn } from '@/utils/cn';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'nb-skeleton-stripes animate-stripes border-3 border-nb-black motion-reduce:animate-none',
        className,
      )}
    />
  );
}