/**
 * 标签：默认黄底黑边，支持热门 / 新梗配色
 */
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type TagVariant = 'yellow' | 'hot' | 'new' | 'plain';

const VARIANTS: Record<TagVariant, string> = {
  yellow: 'bg-nb-yellow text-nb-black',
  hot: 'bg-nb-pink text-nb-black',
  new: 'bg-nb-green text-nb-black',
  plain: 'bg-nb-white text-nb-black',
};

export function Tag({
  children,
  variant = 'yellow',
  className,
}: {
  children: ReactNode;
  variant?: TagVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-block whitespace-nowrap border-2 border-nb-black px-2 py-0.5 text-[11px] font-bold',
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}