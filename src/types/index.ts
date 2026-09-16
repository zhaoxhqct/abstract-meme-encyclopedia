/**
 * 全局类型定义
 */

/** 梗分类标识 */
export type CategoryId = 'person' | 'event' | 'phrase' | 'behavior' | 'internet';

/** 分类筛选项（含「全部」） */
export type CategoryFilter = CategoryId | 'all';

/** 分类元信息 */
export interface Category {
  id: CategoryFilter;
  name: string;
  icon: string;
  /** 分类专属主题色，用于分类页配色 */
  accent: string;
  description: string;
}

/** 一条梗 */
export interface Meme {
  id: number;
  title: string;
  category: CategoryId;
  author: string;
  authorAvatar: string;
  /** 渐变封面（无图片时的 fallback），形如 linear-gradient(135deg, ...) */
  cover: string;
  /** 真实图片地址，优先于渐变渲染，可来自 import 的资源或用户上传 */
  coverImage?: string;
  coverEmoji: string;
  summary: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
  hot: boolean;
  /** 私密梗：仅在作者个人主页可见 */
  isPrivate?: boolean;
}

/** 评论，parentId 存在时表示二级回复 */
export interface Comment {
  id: number;
  memeId: number;
  user: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
  parentId?: number;
}

/** 用户 */
export interface User {
  id: number;
  username: string;
  avatar: string;
  email: string;
  bio: string;
  joinDate: string;
  publishedMemes: number[];
  likedMemes: number[];
  favoriteMemes: number[];
}

/** 发布 / 编辑表单数据（id 与统计字段由 store 生成） */
export type MemeDraft = Omit<Meme, 'id' | 'likes' | 'comments' | 'views' | 'createdAt'>;

/** 封面预设（渐变 + emoji） */
export interface CoverOption {
  gradient: string;
  emoji: string;
}

/** 探索页排序方式 */
export type SortKey = 'latest' | 'hot' | 'views' | 'likes';

/** 个人主页 Tab */
export type ProfileTab = 'published' | 'liked' | 'favorite';

/** 排序选项（用于渲染下拉框） */
export interface SortOption {
  value: SortKey;
  label: string;
}