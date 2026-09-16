/**
 * 用户状态：登录、点赞、收藏、资料编辑
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEMO_USER } from '@/data/memes';
import { useMemeStore } from '@/store/useMemeStore';
import type { User } from '@/types';
import { todayISO, uid } from '@/utils/format';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

interface UserState {
  user: User | null;
  /** 用新用户名创建一个本地账号（mock 登录） */
  login: (username: string) => void;
  /** 使用演示账号登录，自带发布 / 点赞 / 收藏数据 */
  loginAsDemo: () => void;
  logout: () => void;
  /** 切换点赞，返回切换后的状态；未登录返回 null */
  toggleLike: (memeId: number) => boolean | null;
  /** 切换收藏，返回切换后的状态；未登录返回 null */
  toggleFavorite: (memeId: number) => boolean | null;
  /** 发布成功后把梗加入个人作品列表 */
  addPublished: (memeId: number) => void;
  /** 删除梗时同步移除作品记录 */
  removePublished: (memeId: number) => void;
  updateProfile: (data: Partial<Pick<User, 'username' | 'avatar' | 'bio' | 'email'>>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: clone(DEMO_USER),

      login: (username) => {
        const name = username.trim();
        set({
          user: {
            id: uid(),
            username: name,
            avatar: name.slice(0, 1).toUpperCase() || '😎',
            email: `${name}@example.com`,
            bio: '抽象梗文化爱好者',
            joinDate: todayISO(),
            publishedMemes: [],
            likedMemes: [],
            favoriteMemes: [],
          },
        });
      },

      loginAsDemo: () => set({ user: clone(DEMO_USER) }),

      logout: () => set({ user: null }),

      toggleLike: (memeId) => {
        const { user } = get();
        if (!user) return null;
        const liked = user.likedMemes.includes(memeId);
        set({
          user: {
            ...user,
            likedMemes: liked
              ? user.likedMemes.filter((id) => id !== memeId)
              : [memeId, ...user.likedMemes],
          },
        });
        useMemeStore.getState().bumpLikes(memeId, liked ? -1 : 1);
        return !liked;
      },

      toggleFavorite: (memeId) => {
        const { user } = get();
        if (!user) return null;
        const favorited = user.favoriteMemes.includes(memeId);
        set({
          user: {
            ...user,
            favoriteMemes: favorited
              ? user.favoriteMemes.filter((id) => id !== memeId)
              : [memeId, ...user.favoriteMemes],
          },
        });
        return !favorited;
      },

      addPublished: (memeId) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, publishedMemes: [memeId, ...user.publishedMemes] } });
      },

      removePublished: (memeId) => {
        const { user } = get();
        if (!user) return;
        set({
          user: {
            ...user,
            publishedMemes: user.publishedMemes.filter((id) => id !== memeId),
            likedMemes: user.likedMemes.filter((id) => id !== memeId),
            favoriteMemes: user.favoriteMemes.filter((id) => id !== memeId),
          },
        });
      },

      updateProfile: (data) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, ...data } });
      },
    }),
    {
      name: 'nb-user-store',
      version: 1,
    },
  ),
);