/**
 * 响应式梗卡片网格，带错峰入场动画
 */
import { MemeCard } from '@/components/meme/MemeCard';
import type { Meme } from '@/types';
import { cn } from '@/utils/cn';

export type GridColumns = 'default' | 'wide';

const COLUMNS: Record<GridColumns, string> = {
  default: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  wide: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
};

export function MemeGrid({
  memes,
  columns = 'default',
  className,
  showPrivate = false,
}: {
  memes: Meme[];
  columns?: GridColumns;
  className?: string;
  showPrivate?: boolean;
}) {
  return (
    <div className={cn('grid gap-5', COLUMNS[columns], className)}>
      {memes.map((meme, index) => (
        <MemeCard key={meme.id} meme={meme} index={index} showPrivate={showPrivate} />
      ))}
    </div>
  );
}