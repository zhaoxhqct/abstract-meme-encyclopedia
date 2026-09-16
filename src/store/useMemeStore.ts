/**
 * 梗与评论的数据仓库，持久化到 localStorage
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { COMMENTS as SEED_COMMENTS, MEMES as SEED_MEMES } from '@/data/memes';
import type { Comment, Meme, MemeDraft } from '@/types';
import { formatDateTime, todayISO, uid } from '@/utils/format';

/** 深拷贝 mock 数据，避免 store 修改到模块级常量 */
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** 取下一个可用 id */
function nextId(memes: Meme[]): number {
  return memes.reduce((max, m) => Math.max(max, m.id), 0) + 1;
}

interface MemeState {
  memes: Meme[];
  comments: Record<number, Comment[]>;
  /** 新增梗，返回创建后的完整对象（含 id） */
  addMeme: (draft: MemeDraft) => Meme;
  updateMeme: (id: number, data: Partial<Meme>) => void;
  deleteMeme: (id: number) => void;
  incrementView: (id: number) => void;
  /** 点赞数增减，供用户操作联动 */
  bumpLikes: (id: number, delta: number) => void;
  /** 发表评论或回复 */
  addComment: (
    memeId: number,
    content: string,
    author: { username: string; avatar: string },
    parentId?: number,
  ) => void;
  deleteComment: (memeId: number, commentId: number) => void;
  likeComment: (memeId: number, commentId: number) => void;
  /** 清空本地缓存，恢复到初始 mock 数据 */
  resetData: () => void;
}

export const useMemeStore = create<MemeState>()(
  persist(
    (set, get) => ({
      memes: clone(SEED_MEMES),
      comments: clone(SEED_COMMENTS),

      addMeme: (draft) => {
        const meme: Meme = {
          ...draft,
          id: nextId(get().memes),
          likes: 0,
          comments: 0,
          views: 0,
          createdAt: todayISO(),
        };
        set({ memes: [meme, ...get().memes] });
        return meme;
      },

      updateMeme: (id, data) =>
        set({ memes: get().memes.map((m) => (m.id === id ? { ...m, ...data } : m)) }),

      deleteMeme: (id) => {
        const comments = { ...get().comments };
        delete comments[id];
        set({ memes: get().memes.filter((m) => m.id !== id), comments });
      },

      incrementView: (id) =>
        set({
          memes: get().memes.map((m) => (m.id === id ? { ...m, views: m.views + 1 } : m)),
        }),

      bumpLikes: (id, delta) =>
        set({
          memes: get().memes.map((m) =>
            m.id === id ? { ...m, likes: Math.max(0, m.likes + delta) } : m,
          ),
        }),

      addComment: (memeId, content, author, parentId) => {
        const comment: Comment = {
          id: uid(),
          memeId,
          user: author.username,
          avatar: author.avatar,
          content,
          time: formatDateTime(),
          likes: 0,
          ...(parentId ? { parentId } : {}),
        };
        const list = get().comments[memeId] ?? [];
        set({
          comments: { ...get().comments, [memeId]: [comment, ...list] },
          memes: get().memes.map((m) =>
            m.id === memeId ? { ...m, comments: m.comments + 1 } : m,
          ),
        });
      },

      deleteComment: (memeId, commentId) => {
        const list = get().comments[memeId] ?? [];
        const removed = list.filter((c) => c.id === commentId || c.parentId === commentId).length;
        set({
          comments: {
            ...get().comments,
            [memeId]: list.filter((c) => c.id !== commentId && c.parentId !== commentId),
          },
          memes: get().memes.map((m) =>
            m.id === memeId ? { ...m, comments: Math.max(0, m.comments - removed) } : m,
          ),
        });
      },

      likeComment: (memeId, commentId) =>
        set({
          comments: {
            ...get().comments,
            [memeId]: (get().comments[memeId] ?? []).map((c) =>
              c.id === commentId ? { ...c, likes: c.likes + 1 } : c,
            ),
          },
        }),

      resetData: () => set({ memes: clone(SEED_MEMES), comments: clone(SEED_COMMENTS) }),
    }),
    {
      name: 'nb-meme-encyclopedia',
      version: 1,
    },
  ),
);