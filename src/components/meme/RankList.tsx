/**
 * 热度榜
 */
import { Link } from 'react-router-dom';
import type { Meme } from '@/types';
import { cn } from '@/utils/cn';
import { formatNumber } from '@/utils/format';

const TOP_COLORS = ['bg-nb-yellow', 'bg-nb-pink', 'bg-nb-blue'];

export function RankList({ memes }: { memes: Meme[] }) {
  return (
    <ol className="list-none">
      {memes.map((meme, index) => (
        <li key={meme.id}>
          <Link
            to={`/meme/${meme.id}`}
            className="flex items-center gap-3 border-b-2 border-dashed border-nb-black py-2.5 transition-nb last:border-b-0 hover:pl-2"
          >
            <span
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center border-2 border-nb-black text-sm font-black',
                TOP_COLORS[index] ?? 'bg-nb-white',
              )}
            >
              {index + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">{meme.title}</span>
              <span className="block text-xs font-medium text-nb-muted">
                👁 {formatNumber(meme.views)} 浏览
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}