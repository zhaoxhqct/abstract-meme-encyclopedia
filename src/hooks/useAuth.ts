/**
 * 登录态与用户操作封装：未登录时会自动拉起登录弹窗
 */
import { useCallback } from 'react';
import { useToast } from '@/hooks/useToast';
import { useUiStore } from '@/store/useUiStore';
import { useUserStore } from '@/store/useUserStore';

export function useAuth() {
  const user = useUserStore((state) => state.user);
  const login = useUserStore((state) => state.login);
  const loginAsDemo = useUserStore((state) => state.loginAsDemo);
  const logoutAction = useUserStore((state) => state.logout);
  const toggleLikeAction = useUserStore((state) => state.toggleLike);
  const toggleFavoriteAction = useUserStore((state) => state.toggleFavorite);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const openLogin = useUiStore((state) => state.openLogin);
  const { showToast } = useToast();

  /** 需要登录的操作统一走这里 */
  const requireLogin = useCallback((): boolean => {
    if (!user) {
      openLogin();
      showToast('请先登录');
      return false;
    }
    return true;
  }, [user, openLogin, showToast]);

  const isLiked = useCallback((memeId: number) => user?.likedMemes.includes(memeId) ?? false, [user]);

  const isFavorited = useCallback(
    (memeId: number) => user?.favoriteMemes.includes(memeId) ?? false,
    [user],
  );

  const toggleLike = useCallback(
    (memeId: number) => {
      if (!requireLogin()) return;
      const liked = toggleLikeAction(memeId);
      if (liked !== null) showToast(liked ? '点赞成功 ❤️' : '已取消点赞');
    },
    [requireLogin, toggleLikeAction, showToast],
  );

  const toggleFavorite = useCallback(
    (memeId: number) => {
      if (!requireLogin()) return;
      const favorited = toggleFavoriteAction(memeId);
      if (favorited !== null) showToast(favorited ? '收藏成功 ⭐' : '已取消收藏');
    },
    [requireLogin, toggleFavoriteAction, showToast],
  );

  const logout = useCallback(() => {
    logoutAction();
    showToast('已退出登录');
  }, [logoutAction, showToast]);

  return {
    user,
    isLoggedIn: Boolean(user),
    login,
    loginAsDemo,
    logout,
    updateProfile,
    requireLogin,
    isLiked,
    isFavorited,
    toggleLike,
    toggleFavorite,
  };
}