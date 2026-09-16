/**
 * 页面骨架：导航 + 页面内容（入场动画）+ 页脚
 */
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

export function Layout() {
  const location = useLocation();
  const outlet = useOutlet();

  // 路由切换回到顶部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <p className="border-b-3 border-nb-black bg-nb-pink px-4 py-2 text-center text-xs font-bold sm:text-[13px]">
        🗂 示例数据：站内梗内容为玩梗记录与演示文本，不作为事实陈述
      </p>
      {/*
        key 绑定 pathname：页面切换时重新挂载，播放入场动画
        （query 变化不重挂载，避免筛选时整页闪烁）
      */}
      <motion.main
        key={location.pathname}
        className="flex-1"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {outlet}
      </motion.main>
      <Footer />
    </div>
  );
}

/** 页面内容容器：统一最大宽度与内边距 */
export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-10 ${className ?? ''}`}>
      {children}
    </div>
  );
}
