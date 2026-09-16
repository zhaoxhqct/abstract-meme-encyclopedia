/**
 * 页脚
 */
export function Footer() {
  return (
    <footer className="mt-16 border-t-3 border-nb-black bg-nb-black px-4 py-8 text-center text-sm font-medium text-nb-yellow">
      <p>抽象梗百科 · NEO-BRUTALISM EDITION · 记录每一个让人会心一笑的瞬间</p>
      <p className="mt-2 text-xs text-nb-yellow/70">
        原型数据均为本地 Mock，发布 / 点赞 / 收藏会保存在浏览器 localStorage 中
      </p>
      <p className="mt-2 text-xs font-bold text-nb-pink">
        站内梗内容为示例数据与玩梗记录，不构成对任何人的事实陈述
      </p>
    </footer>
  );
}
