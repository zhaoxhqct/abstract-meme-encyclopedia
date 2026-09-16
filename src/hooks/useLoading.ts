/**
 * 模拟首屏加载：本地数据是同步可读的，
 * 这里刻意延迟一小段时间，用于展示 NeoBrutalism 骨架屏
 */
import { useEffect, useState } from 'react';

export function useSimulatedLoading(delay = 350): boolean {
  const [loading, setLoading] = useState(delay > 0);

  useEffect(() => {
    if (delay <= 0) return;
    const timer = window.setTimeout(() => setLoading(false), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);

  return loading;
}