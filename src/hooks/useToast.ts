/**
 * 轻量 Toast 状态：任意位置 push 一条提示
 */
import { create } from 'zustand';
import { uid } from '@/utils/format';

export interface ToastItem {
  id: number;
  message: string;
}

interface ToastState {
  toasts: ToastItem[];
  push: (message: string, duration?: number) => void;
  dismiss: (id: number) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: (message, duration = 2200) => {
    const id = uid();
    set({ toasts: [...get().toasts, { id, message }] });
    window.setTimeout(() => get().dismiss(id), duration);
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));

/** 组件内使用：const { showToast } = useToast(); */
export function useToast() {
  const push = useToastStore((state) => state.push);
  return { showToast: push };
}

/** 非组件环境（store、工具函数）也能弹提示 */
export function showToast(message: string): void {
  useToastStore.getState().push(message);
}