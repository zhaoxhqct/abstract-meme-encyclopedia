/**
 * 全局 UI 状态：登录弹窗、移动端导航
 */
import { create } from 'zustand';

interface UiState {
  /** 登录 / 注册弹窗是否打开 */
  loginOpen: boolean;
  /** 移动端汉堡菜单是否展开 */
  mobileNavOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  toggleMobileNav: () => void;
  closeMobileNav: () => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  loginOpen: false,
  mobileNavOpen: false,
  openLogin: () => set({ loginOpen: true, mobileNavOpen: false }),
  closeLogin: () => set({ loginOpen: false }),
  toggleMobileNav: () => set({ mobileNavOpen: !get().mobileNavOpen }),
  closeMobileNav: () => set({ mobileNavOpen: false }),
}));