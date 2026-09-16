/**
 * 应用路由表
 *
 * 基础 5 页 + 扩展的搜索页 / 分类页 / 404 页，
 * 统一套用 Layout（导航 + 页面入场动画 + 页脚）。
 */
import { Route, Routes } from 'react-router-dom';
import { LoginModal } from '@/components/auth/LoginModal';
import { Layout } from '@/components/layout';
import { ToastHost } from '@/components/ui';
import CategoryPage from '@/pages/CategoryPage';
import Detail from '@/pages/Detail';
import Explore from '@/pages/Explore';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import Profile from '@/pages/Profile';
import Publish from '@/pages/Publish';
import Search from '@/pages/Search';

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/meme/:id" element={<Detail />} />
          <Route path="/publish" element={<Publish />} />
          <Route path="/publish/:id" element={<Publish />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <ToastHost />
      <LoginModal />
    </>
  );
}