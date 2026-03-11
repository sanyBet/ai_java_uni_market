import { Home, Grid3x3, ShoppingCart, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';

export function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { name: '首页', path: '/', icon: Home },
    { name: '分类', path: '/category', icon: Grid3x3 },
    { name: '购物车', path: '/cart', icon: ShoppingCart },
    { name: '我的', path: '/profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-[390px] mx-auto flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex-1 flex flex-col items-center py-2 gap-1"
            >
              <Icon
                className={`w-6 h-6 ${
                  isActive ? 'text-red-500' : 'text-gray-500'
                }`}
              />
              <span
                className={`text-xs ${
                  isActive ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                {tab.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
