/**
 * 极简 className 合并工具，避免为原型项目引入额外依赖
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}