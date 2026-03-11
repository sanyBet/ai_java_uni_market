import { Outlet, useLocation } from 'react-router';
import { TabBar } from '../components/TabBar';

export function MainLayout() {
  const location = useLocation();
  
  // 不显示 TabBar 的页面
  const hideTabBarPaths = ['/checkout', '/orders', '/address', '/support', '/settings'];
  const shouldShowTabBar = !hideTabBarPaths.some(path => 
    location.pathname.startsWith(path)
  ) && !location.pathname.startsWith('/product/');

  return (
    <div className="max-w-[390px] mx-auto bg-white min-h-screen relative">
      <Outlet />
      {shouldShowTabBar && <TabBar />}
    </div>
  );
}