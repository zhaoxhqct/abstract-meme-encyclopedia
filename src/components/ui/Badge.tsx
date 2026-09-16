/**
 * 倾斜贴纸风格的角标
 */
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function Badge({
  children,
  className,
  rotate = -3,
}: {
  children: ReactNode;
  className?: string;
  /** 旋转角度，默认 -3deg */
  rotate?: number;
}) {
  return (
    <span
      style={{ transform: `rotate(${rotate}deg)` }}
      className={cn(
        'inline-block border-2 border-nb-black bg-nb-black px-3 py-1 text-[11px] font-bold text-nb-yellow',
        className,
      )}
    >
      {children}
    </span>
  );
}