/**
 * 顶部导航：黄底黑边、粘性定位，移动端折叠为汉堡菜单
 */
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Button, ButtonLink } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useUiStore } from '@/store/useUiStore';
import { cn } from '@/utils/cn';

interface NavItem {
  key: string;
  label: string;
  to: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: '首页', to: '/' },
  { key: 'explore', label: '探索', to: '/explore' },
  { key: 'hot', label: '热门', to: '/explore?sort=hot' },
  { key: 'profile', label: '我的', to: '/profile' },
];

/** 根据当前路由推断高亮的导航项（详情页、发布页归属「探索」） */
function resolveActiveKey(pathname: string, search: string): string {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/profile')) return 'profile';
  if (pathname.startsWith('/explore')) {
    return new URLSearchParams(search).get('sort') === 'hot' ? 'hot' : 'explore';
  }
  if (
    pathname.startsWith('/meme') ||
    pathname.startsWith('/publish') ||
    pathname.startsWith('/category') ||
    pathname.startsWith('/search')
  ) {
    return 'explore';
  }
  return 'home';
}

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const mobileNavOpen = useUiStore((state) => state.mobileNavOpen);
  const toggleMobileNav = useUiStore((state) => state.toggleMobileNav);
  const closeMobileNav = useUiStore((state) => state.closeMobileNav);
  const openLogin = useUiStore((state) => state.openLogin);
  const [keyword, setKeyword] = useState('');

  // 路由变化时收起移动端菜单
  useEffect(() => closeMobileNav(), [location.pathname, closeMobileNav]);

  const activeKey = resolveActiveKey(location.pathname, location.search);

  const submitSearch = () => {
    const kw = keyword.trim();
    if (!kw) return;
    navigate(`/search?q=${encodeURIComponent(kw)}`);
    setKeyword('');
    closeMobileNav();
  };

  const linkClass = (key: string) =>
    cn(
      'border-3 px-4 py-2 text-[15px] font-bold transition-nb',
      activeKey === key
        ? 'border-nb-black bg-nb-black text-nb-yellow'
        : 'border-transparent text-nb-black hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-nb-black hover:bg-nb-white hover:shadow-nb',
    );

  return (
    <header className="sticky top-0 z-[100] border-b-3 border-nb-black bg-nb-yellow">
      <div className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-3" aria-label="抽象梗百科首页">
          <span className="flex h-[42px] w-[42px] -rotate-3 items-center justify-center border-3 border-nb-black bg-nb-black text-xl text-nb-yellow">
            📚
          </span>
          <span className="text-xl font-black tracking-tight sm:text-[22px]">抽象梗百科</span>
        </Link>

        <nav aria-label="主导航" className="hidden lg:block">
          <ul className="flex list-none items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link to={item.to} className={linkClass(item.key)} aria-current={activeKey === item.key}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="relative hidden md:block">
            <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm">
              🔍
            </span>
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') submitSearch();
              }}
              placeholder="搜点什么梗..."
              aria-label="搜索梗"
              className="w-[200px] border-3 border-nb-black bg-nb-white py-2 pl-9 pr-3.5 text-sm font-medium transition-nb placeholder:text-nb-muted/70 focus:w-[240px] focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-nb focus:outline-none"
            />
          </div>

          {isLoggedIn && user ? (
            <div className="hidden items-center gap-2.5 md:flex">
              <ButtonLink to="/publish" variant="primary" size="md">
                + 发布梗
              </ButtonLink>
              <Link to="/profile" aria-label={`${user.username} 的个人主页`}>
                <Avatar
                  value={user.avatar}
                  className="h-10 w-10 shadow-nb transition-nb hover:-translate-x-0.5 hover:-translate-y-0.5 hover:rotate-[-5deg] hover:shadow-nb-lg"
                  textClassName="text-lg"
                />
              </Link>
              <Button size="md" variant="white" onClick={logout}>
                退出
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2.5 md:flex">
              <Button variant="white" onClick={openLogin}>
                登录
              </Button>
              <Button variant="primary" onClick={openLogin}>
                注册
              </Button>
            </div>
          )}

          <button
            type="button"
            aria-label={mobileNavOpen ? '收起菜单' : '展开菜单'}
            aria-expanded={mobileNavOpen}
            onClick={toggleMobileNav}
            className="flex h-11 w-11 items-center justify-center border-3 border-nb-black bg-nb-white text-lg shadow-nb transition-nb active:translate-x-0.5 active:translate-y-0.5 active:shadow-nb-none lg:hidden"
          >
            {mobileNavOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {mobileNavOpen ? (
        <div className="border-t-3 border-nb-black bg-nb-yellow px-4 py-4 lg:hidden">
          <div className="relative mb-3">
            <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm">
              🔍
            </span>
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') submitSearch();
              }}
              placeholder="搜点什么梗..."
              aria-label="搜索梗"
              className="w-full border-3 border-nb-black bg-nb-white py-3 pl-9 pr-3 text-sm font-medium focus:outline-none"
            />
          </div>

          <ul className="mb-3 list-none space-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  to={item.to}
                  onClick={closeMobileNav}
                  className={cn('block', linkClass(item.key))}
                  aria-current={activeKey === item.key}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {isLoggedIn && user ? (
            <div className="flex items-center gap-2.5">
              <ButtonLink to="/publish" variant="primary" onClick={closeMobileNav}>
                + 发布梗
              </ButtonLink>
              <Button
                variant="white"
                onClick={() => {
                  logout();
                  closeMobileNav();
                }}
              >
                退出登录
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Button
                variant="primary"
                onClick={() => {
                  openLogin();
                  closeMobileNav();
                }}
              >
                登录 / 注册
              </Button>
            </div>
          )}
        </div>
      ) : null}
    </header>
  );
}