/**
 * 梗数据的读取 hooks：统一处理可见性与筛选逻辑
 */
import { useMemo } from 'react';
import { useMemeStore } from '@/store/useMemeStore';
import { useUserStore } from '@/store/useUserStore';
import type { CategoryFilter, Comment, Meme, SortKey } from '@/types';
import { filterByCategory, publicMemes, relatedMemes, searchMemes, sortMemes } from '@/utils/meme';

/** 公开列表：过滤掉别人的私密梗 */
export function usePublicMemes(): Meme[] {
  const memes = useMemeStore((state) => state.memes);
  const ownedIds = useUserStore((state) => state.user?.publishedMemes ?? []);
  return useMemo(() => publicMemes(memes, ownedIds), [memes, ownedIds]);
}

/** 是否正在加载（本地数据同步可读，这里仅用于展示骨架屏） */
export { useSimulatedLoading as useLoading } from '@/hooks/useLoading';

/** 单条梗 */
export function useMeme(id?: number): Meme | undefined {
  const memes = useMemeStore((state) => state.memes);
  return useMemo(() => memes.find((m) => m.id === id), [memes, id]);
}

/** 某条梗的评论 */
export function useComments(memeId?: number): Comment[] {
  const comments = useMemeStore((state) => state.comments);
  return useMemo(() => (memeId ? comments[memeId] ?? [] : []), [comments, memeId]);
}

/** 首页轮播使用的热门梗 */
export function useHotMemes(limit?: number): Meme[] {
  const memes = usePublicMemes();
  return useMemo(() => {
    const hot = memes.filter((m) => m.hot);
    return typeof limit === 'number' ? hot.slice(0, limit) : hot;
  }, [memes, limit]);
}

/** 最新发布 */
export function useLatestMemes(limit = 4): Meme[] {
  const memes = usePublicMemes();
  return useMemo(() => sortMemes(memes, 'latest').slice(0, limit), [memes, limit]);
}

/** 热度榜（按浏览量） */
export function useRankMemes(limit = 8): Meme[] {
  const memes = usePublicMemes();
  return useMemo(() => sortMemes(memes, 'views').slice(0, limit), [memes, limit]);
}

/** 相关推荐 */
export function useRelatedMemes(current: Meme | undefined, count = 4): Meme[] {
  const memes = usePublicMemes();
  return useMemo(
    () => (current ? relatedMemes(memes, current, count) : []),
    [memes, current, count],
  );
}

/** 探索页 / 搜索页 / 分类页共用的筛选结果 */
export function useMemeResults(options: {
  category?: CategoryFilter;
  keyword?: string;
  sort?: SortKey;
}): Meme[] {
  const memes = usePublicMemes();
  const { category = 'all', keyword = '', sort = 'latest' } = options;
  return useMemo(() => {
    const filtered = searchMemes(filterByCategory(memes, category), keyword);
    return sortMemes(filtered, sort);
  }, [memes, category, keyword, sort]);
}