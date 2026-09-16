/**
 * 搜索历史：保存在 localStorage，最多保留 8 条
 */
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'nb-search-history';
const MAX_ITEMS = 8;

function readHistory(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(readHistory);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addHistory = useCallback((keyword: string) => {
    const kw = keyword.trim();
    if (!kw) return;
    setHistory((prev) => [kw, ...prev.filter((item) => item !== kw)].slice(0, MAX_ITEMS));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  return { history, addHistory, clearHistory };
}