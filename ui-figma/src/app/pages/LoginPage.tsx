import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nickname: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/profile';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error('请输入账号和密码');
      return;
    }

    setIsLoading(true);
    
    const success = await login(formData.username, formData.password);
    
    setIsLoading(false);

    if (success) {
      toast.success('登录成功');
      navigate(from, { replace: true });
    } else {
      toast.error('账号或密码错误');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error('请输入账号和密码');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('密码长度至少6位');
      return;
    }

    setIsLoading(true);
    
    const success = await register(
      formData.username,
      formData.password,
      formData.nickname || formData.username
    );
    
    setIsLoading(false);

    if (success) {
      toast.success('注册成功');
      navigate(from, { replace: true });
    } else {
      toast.error('该账号已存在');
    }
  };

  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setFormData({ username: '', password: '', nickname: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-lg font-semibold text-center">
            {activeTab === 'login' ? '登录' : '注册'}
          </h1>
          <div className="w-6" />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white">
        <div className="flex">
          <button
            onClick={() => handleTabChange('login')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'login'
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-gray-600'
            }`}
          >
            账号登录
          </button>
          <button
            onClick={() => handleTabChange('register')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'register'
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-gray-600'
            }`}
          >
            注册账号
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="p-6 mt-6">
        <form onSubmit={activeTab === 'login' ? handleLogin : handleRegister}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">账号</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="请输入账号"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">密码</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder={activeTab === 'login' ? '请输入密码' : '请输入密码（至少6位）'}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={isLoading}
              />
            </div>

            {activeTab === 'register' && (
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  昵称（可选）
                </label>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) =>
                    setFormData({ ...formData, nickname: e.target.value })
                  }
                  placeholder="请输入昵称，不填则默认为账号"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={isLoading}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 py-3 bg-red-500 text-white rounded-full font-medium disabled:bg-gray-300"
          >
            {isLoading ? '处理中...' : activeTab === 'login' ? '登录' : '注册'}
          </button>
        </form>

        {activeTab === 'login' && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              还没有账号？
              <button
                onClick={() => handleTabChange('register')}
                className="text-red-500 ml-1"
              >
                立即注册
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
