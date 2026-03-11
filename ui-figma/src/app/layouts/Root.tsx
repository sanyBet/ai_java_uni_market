import { Outlet, useLocation } from "react-router";
import { TabBar } from "../components/TabBar";

export function Root() {
  const location = useLocation();
  
  // 不显示 TabBar 的页面
  const hideTabBarPaths = ['/checkout', '/orders'];
  const shouldShowTabBar = !hideTabBarPaths.some(path => 
    location.pathname.startsWith(path)
  ) && !location.pathname.startsWith('/product/');

  return (
    <div className="min-h-screen bg-[#f5f5f5] max-w-[390px] mx-auto relative">
      <div className={shouldShowTabBar ? "pb-16" : ""}>
        <Outlet />
      </div>
      {shouldShowTabBar && <TabBar />}
    </div>
  );
}
