/**
 * 展示层格式化工具
 */

/** 数字缩写：45200 -> 4.5w */
export function formatNumber(num: number): string {
  if (num >= 10000) return `${(num / 10000).toFixed(1)}w`;
  return String(num);
}

/** 日期展示：2024-03-15 -> 2024年3月15日 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

/** 评论时间戳：2024-03-16 10:23 */
export function formatDateTime(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

/** 今天的 YYYY-MM-DD，用于新发布内容 */
export function todayISO(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** mock 阶段的自增 id */
export function uid(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}