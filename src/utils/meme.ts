/**
 * 梗数据相关的纯函数工具：筛选 / 搜索 / 排序 / 推荐
 */
import { CATEGORIES } from '@/data/memes';
import type { Category, CategoryFilter, Meme, SortKey, SortOption } from '@/types';

/** 排序下拉选项 */
export const SORT_OPTIONS: SortOption[] = [
  { value: 'latest', label: '最新发布' },
  { value: 'hot', label: '最热门' },
  { value: 'views', label: '浏览量' },
  { value: 'likes', label: '点赞数' },
];

/** 按 id 查分类元信息 */
export function getCategory(id: CategoryFilter): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

/** 分类名 */
export function getCategoryName(id: CategoryFilter): string {
  return getCategory(id)?.name ?? id;
}

/** 分类主题色 */
export function getCategoryAccent(id: CategoryFilter): string {
  return getCategory(id)?.accent ?? '#FFE500';
}

/**
 * 公开列表：过滤私密梗，作者本人仍可在个人主页看到自己的私密梗
 */
export function publicMemes(memes: Meme[], ownedIds: number[] = []): Meme[] {
  return memes.filter((m) => !m.isPrivate || ownedIds.includes(m.id));
}

/** 按分类筛选 */
export function filterByCategory(memes: Meme[], category: CategoryFilter): Meme[] {
  if (category === 'all') return memes;
  return memes.filter((m) => m.category === category);
}

/** 关键词搜索：命中标题 / 简介 / 标签 */
export function searchMemes(memes: Meme[], keyword: string): Meme[] {
  const kw = keyword.trim().toLowerCase();
  if (!kw) return memes;
  return memes.filter(
    (m) =>
      m.title.toLowerCase().includes(kw) ||
      m.summary.toLowerCase().includes(kw) ||
      m.tags.some((tag) => tag.toLowerCase().includes(kw)),
  );
}

/** 排序（返回新数组，不修改入参） */
export function sortMemes(memes: Meme[], sort: SortKey): Meme[] {
  const list = [...memes];
  switch (sort) {
    case 'hot':
    case 'likes':
      return list.sort((a, b) => b.likes - a.likes);
    case 'views':
      return list.sort((a, b) => b.views - a.views);
    case 'latest':
    default:
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

/** 相关推荐：优先同分类，不足时用其它分类补齐 */
export function relatedMemes(memes: Meme[], current: Meme, count = 4): Meme[] {
  const sameCategory = memes.filter((m) => m.id !== current.id && m.category === current.category);
  const others = memes.filter((m) => m.id !== current.id && m.category !== current.category);
  return [...sameCategory, ...others].slice(0, count);
}

/**
 * 浏览趋势 mock：基于梗 id 生成稳定的伪随机曲线，
 * 保证同一篇梗每次渲染的数据一致
 */
export function viewTrend(meme: Meme, points = 7): number[] {
  const seed = meme.id * 9301 + 49297;
  const base = Math.max(20, Math.round(meme.views / 60));
  return Array.from({ length: points }, (_, i) => {
    const noise = ((seed * (i + 3)) % 233) / 233;
    const wave = Math.sin((i / points) * Math.PI * 1.6);
    return Math.round(base * (0.45 + wave * 0.55 + noise * 0.35));
  });
}

/** 从内容里推断正文小节标题（原型内容用「1. 2. 3.」或换行分段） */
export function splitContent(content: string): string[] {
  return content.split('\n').filter((line) => line.trim().length > 0);
}