/**
 * 相关推荐列表
 */
import { Link } from 'react-router-dom';
import { MemeCover } from '@/components/meme/MemeCover';
import type { Meme } from '@/types';
import { formatNumber } from '@/utils/format';

export function RelatedList({ memes }: { memes: Meme[] }) {
  return (
    <ul className="list-none">
      {memes.map((meme) => (
        <li key={meme.id}>
          <Link
            to={`/meme/${meme.id}`}
            className="flex gap-3 border-b-2 border-dashed border-nb-black py-3 transition-nb last:border-b-0 hover:pl-1.5"
          >
            <MemeCover
              cover={meme.cover}
              coverImage={meme.coverImage}
              coverEmoji={meme.coverEmoji}
              alt={meme.title}
              className="h-[52px] w-[52px] shrink-0 border-2 border-nb-black"
              emojiClassName="text-[26px]"
            />
            <span className="min-w-0 flex-1">
              <span className="mb-1 block truncate text-sm font-bold">{meme.title}</span>
              <span className="block text-xs font-medium text-nb-muted">
                👁 {formatNumber(meme.views)}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}