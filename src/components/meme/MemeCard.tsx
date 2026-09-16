/**
 * 梗卡片：封面 + 标题 + 简介 + 标签 + 点赞 / 评论统计
 */
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartBurst } from '@/components/meme/HeartBurst';
import { MemeCover } from '@/components/meme/MemeCover';
import { Badge, Tag } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import type { Meme } from '@/types';
import { cn } from '@/utils/cn';
import { formatNumber } from '@/utils/format';

export interface MemeCardProps {
  meme: Meme;
  /** 用于入场动画的错峰序号 */
  index?: number;
  className?: string;
  /** 是否展示私密标记（个人主页使用） */
  showPrivate?: boolean;
}

export function MemeCard({ meme, index = 0, className, showPrivate = false }: MemeCardProps) {
  const { isLiked, toggleLike } = useAuth();
  const [burstKey, setBurstKey] = useState(0);
  const liked = isLiked(meme.id);

  const handleLike = () => {
    if (!liked) setBurstKey((key) => key + 1);
    toggleLike(meme.id);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: Math.min(index, 8) * 0.04 }}
      className={cn(
        'group relative flex flex-col border-3 border-nb-black bg-nb-white shadow-nb transition-nb hover:-translate-x-1 hover:-translate-y-1 hover:shadow-nb-xl',
        className,
      )}
    >
      {/* 整卡可点击：用覆盖式链接保证语义，点赞按钮浮在上层 */}
      <Link to={`/meme/${meme.id}`} className="absolute inset-0 z-10" aria-label={meme.title}>
        <span className="sr-only">{meme.title}</span>
      </Link>

      <MemeCover
        cover={meme.cover}
        coverImage={meme.coverImage}
        coverEmoji={meme.coverEmoji}
        alt={meme.title}
        className="h-[130px] border-b-3 border-nb-black"
        emojiClassName="text-[56px] transition-nb group-hover:scale-110 group-hover:rotate-[10deg]"
      />

      <div className="absolute left-2.5 top-2.5 z-20 flex gap-2">
        {meme.hot ? <Badge>🔥 热门</Badge> : null}
        {showPrivate && meme.isPrivate ? <Badge rotate={3} className="bg-nb-white text-nb-black">🔒 私密</Badge> : null}
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="truncate text-[17px] font-black">{meme.title}</h3>
        <p className="mb-3 mt-1.5 line-clamp-2 min-h-[39px] text-[13px] font-medium leading-normal text-nb-muted">
          {meme.summary}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {meme.tags.slice(0, 2).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>

          <div className="relative z-20 flex shrink-0 items-center gap-2.5 text-xs font-bold text-nb-muted">
            <button
              type="button"
              onClick={handleLike}
              aria-pressed={liked}
              aria-label={liked ? '取消点赞' : '点赞'}
              className="relative flex items-center gap-1 transition-nb hover:text-nb-pink"
            >
              <span className={cn('text-sm', liked && 'animate-heart-beat')}>{liked ? '❤️' : '🤍'}</span>
              <span>{formatNumber(meme.likes)}</span>
              <HeartBurst burstKey={burstKey} />
            </button>
            <span className="flex items-center gap-1">
              <span aria-hidden="true">💬</span>
              {formatNumber(meme.comments)}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}