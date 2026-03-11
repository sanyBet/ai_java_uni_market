import { ChevronRight, Package, MapPin, Headphones, Settings, LogOut, Truck, PackageCheck, RotateCcw, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const orderStats = [
  { icon: Package, label: '待发货', count: 2, path: '/orders?status=pending' },
  { icon: Truck, label: '待收货', count: 1, path: '/orders?status=shipping' },
  { icon: PackageCheck, label: '已完成', count: 15, path: '/orders?status=completed' },
  { icon: RotateCcw, label: '退款/售后', count: 0, path: '/orders?status=refund' },
];

const menuItems = [
  { icon: User, label: '个人信息', path: '/profile-info' },
  { icon: Package, label: '我的订单', path: '/orders' },
  { icon: MapPin, label: '收货地址', path: '/address' },
  { icon: Headphones, label: '客服支持', path: '/support' },
  { icon: Settings, label: '设置', path: '/settings' },
];

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/profile' } } });
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    toast.success('已退出登录');
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 px-4 pt-8 pb-24">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.nickname}
            className="w-16 h-16 rounded-full bg-white"
          />
          <div className="flex-1">
            <h2 className="text-white text-lg font-semibold">{user.nickname}</h2>
            <p className="text-white/80 text-sm">会员等级：普通会员</p>
          </div>
        </div>
      </div>

      {/* Order Status */}
      <div className="bg-white -mt-16 mx-4 rounded-lg shadow-sm p-4 mb-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">我的订单</h3>
          <button
            onClick={() => navigate('/orders')}
            className="text-sm text-gray-500 flex items-center"
          >
            查看全部
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {orderStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <button
                key={stat.label}
                onClick={() => navigate(stat.path)}
                className="flex flex-col items-center"
              >
                <div className="relative mb-2">
                  <Icon className="w-6 h-6 text-gray-700" />
                  {stat.count > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {stat.count}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-600">{stat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white mb-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between px-4 py-4 ${
                index < menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="bg-white px-4 py-3">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 border border-red-500 text-red-500 rounded-lg"
        >
          <LogOut className="w-5 h-5" />
          <span>退出登录</span>
        </button>
      </div>
    </div>
  );
}