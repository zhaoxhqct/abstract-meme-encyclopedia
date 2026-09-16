/**
 * 详情页：封面 + 元信息 + 操作栏 + 正文 + 评论区 + 数据统计 / 相关推荐
 */
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CommentSection } from '@/components/comment';
import { PageContainer } from '@/components/layout';
import { HeartBurst, MemeCover, RelatedList, ViewTrendChart } from '@/components/meme';
import { Avatar, Badge, ButtonLink, Card, Empty, PanelCard, StatBox, Tag, buttonClasses } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useMeme, useRelatedMemes } from '@/hooks/useMeme';
import { useToast } from '@/hooks/useToast';
import { useMemeStore } from '@/store/useMemeStore';
import { cn } from '@/utils/cn';
import { formatDate, formatNumber } from '@/utils/format';
import { getCategoryAccent, getCategoryName, splitContent } from '@/utils/meme';

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const memeId = id ? Number(id) : undefined;
  const meme = useMeme(memeId);
  const related = useRelatedMemes(meme, 4);
  const incrementView = useMemeStore((state) => state.incrementView);
  const { user, isLiked, isFavorited, toggleLike, toggleFavorite } = useAuth();
  const { showToast } = useToast();
  const [burstKey, setBurstKey] = useState(0);
  const viewedId = useRef<number | null>(null);

  const owned = Boolean(meme && user?.publishedMemes.includes(meme.id));
  // 别人的私密梗当作不存在处理
  const visible = meme && (!meme.isPrivate || owned) ? meme : undefined;

  useEffect(() => {
    if (!visible || viewedId.current === visible.id) return;
    viewedId.current = visible.id;
    incrementView(visible.id);
  }, [visible, incrementView]);

  if (!visible) {
    return (
      <PageContainer>
        <Empty
          kind="notfound"
          title="未找到该梗"
          description="它可能已被删除，或者链接不太对"
          action={
            <ButtonLink to="/" variant="primary">
              返回首页
            </ButtonLink>
          }
        />
      </PageContainer>
    );
  }

  const liked = isLiked(visible.id);
  const favorited = isFavorited(visible.id);

  const handleLike = () => {
    if (!liked) setBurstKey((key) => key + 1);
    toggleLike(visible.id);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (!navigator.clipboard) {
      showToast('当前浏览器不支持复制，请手动复制地址栏链接');
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast('链接已复制，快去分享吧 🔗');
    } catch {
      showToast('复制失败，请手动复制地址栏链接');
    }
  };

  return (
    <PageContainer>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-7">
        <div className="min-w-0">
          <div className="relative mb-6">
            <MemeCover
              cover={visible.cover}
              coverImage={visible.coverImage}
              coverEmoji={visible.coverEmoji}
              alt={visible.title}
              className="h-[220px] border-4 border-nb-black shadow-nb-lg sm:h-[300px]"
              emojiClassName="text-[96px] sm:text-[130px]"
            />
            <div className="absolute left-4 top-4 flex gap-2">
              {visible.hot ? <Badge>🔥 热门</Badge> : null}
              {visible.isPrivate ? (
                <Badge rotate={3} className="bg-nb-white text-nb-black">
                  🔒 私密
                </Badge>
              ) : null}
            </div>
          </div>

          <h1 className="text-[26px] font-black leading-tight sm:text-[34px]">{visible.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-sm font-bold text-nb-muted">
            <span className="flex items-center gap-2">
              <Avatar value={visible.authorAvatar} className="h-8 w-8" textClassName="text-base" />
              <span className="text-nb-black">{visible.author}</span>
            </span>
            <span>📅 {formatDate(visible.createdAt)}</span>
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="inline-block h-3.5 w-3.5 border-2 border-nb-black"
                style={{ background: getCategoryAccent(visible.category) }}
              />
              {getCategoryName(visible.category)}
            </span>
            <span>👁 {formatNumber(visible.views)} 浏览</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {visible.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={handleLike}
              aria-pressed={liked}
              className={cn(buttonClasses({ variant: liked ? 'pink' : 'white' }), 'relative')}
            >
              <span aria-hidden="true" className={cn(liked && 'animate-heart-beat')}>
                {liked ? '❤️' : '🤍'}
              </span>
              点赞 {formatNumber(visible.likes)}
              <HeartBurst burstKey={burstKey} />
            </button>

            <button
              type="button"
              onClick={() => toggleFavorite(visible.id)}
              aria-pressed={favorited}
              className={cn(buttonClasses({ variant: favorited ? 'yellow' : 'white' }))}
            >
              <span aria-hidden="true">{favorited ? '⭐' : '☆'}</span>
              {favorited ? '已收藏' : '收藏'}
            </button>

            <button type="button" onClick={() => void handleShare()} className={cn(buttonClasses())}>
              <span aria-hidden="true">🔗</span>
              分享
            </button>

            {owned ? (
              <ButtonLink to={`/publish/${visible.id}`} variant="green">
                ✏️ 编辑
              </ButtonLink>
            ) : null}
          </div>

          <Card className="mt-6 p-5 sm:p-7">
            <h2 className="mb-4 border-b-3 border-nb-black pb-3 text-[19px] font-black">📖 梗的由来</h2>
            {splitContent(visible.content).map((line, index) => (
              <p
                key={index}
                className={cn('break-words text-[15px] font-medium leading-[1.9]', index > 0 && 'mt-3')}
              >
                {line}
              </p>
            ))}
          </Card>

          <CommentSection meme={visible} />
        </div>

        <aside className="mt-10 lg:mt-0">
          <PanelCard title="数据统计" icon="📊">
            <div className="grid grid-cols-2 gap-2.5">
              <StatBox value={formatNumber(visible.views)} label="浏览" />
              <StatBox value={formatNumber(visible.likes)} label="点赞" />
              <StatBox value={formatNumber(visible.comments)} label="评论" />
              <StatBox value={visible.tags.length} label="标签" />
            </div>
            <h4 className="mb-3 mt-5 text-sm font-black">📈 浏览趋势</h4>
            <ViewTrendChart meme={visible} />
          </PanelCard>

          <PanelCard title="相关推荐" icon="🔥">
            {related.length > 0 ? (
              <RelatedList memes={related} />
            ) : (
              <p className="text-sm font-medium text-nb-muted">暂时没有相关推荐</p>
            )}
          </PanelCard>
        </aside>
      </div>
    </PageContainer>
  );
}