import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export function ProfileInfoPage() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname || '');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSave = () => {
    if (!nickname.trim()) {
      toast.error('昵称不能为空');
      return;
    }

    updateProfile(nickname, user.avatar);
    toast.success('个人信息已更新');
    setIsEditing(false);
  };

  const handleChangeAvatar = () => {
    // 生成新的随机头像
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;
    updateProfile(user.nickname, newAvatar);
    toast.success('头像已更换');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 border-b">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-lg font-semibold text-center">个人信息</h1>
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="text-red-500 text-sm"
          >
            {isEditing ? '保存' : '编辑'}
          </button>
        </div>
      </div>

      {/* Avatar Section */}
      <div className="bg-white mt-2 p-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.nickname}
              className="w-24 h-24 rounded-full bg-gray-200"
            />
            {isEditing && (
              <button
                onClick={handleChangeAvatar}
                className="absolute bottom-0 right-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-4">点击相机图标更换头像</p>
        </div>
      </div>

      {/* Info List */}
      <div className="bg-white mt-2">
        <div className="px-4 py-4 border-b">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">账号</span>
            <span className="text-gray-800">{user.username}</span>
          </div>
        </div>

        <div className="px-4 py-4 border-b">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">昵称</span>
            {isEditing ? (
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="text-right border-b border-red-500 focus:outline-none px-2 py-1"
                autoFocus
              />
            ) : (
              <span className="text-gray-800">{user.nickname}</span>
            )}
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">用户ID</span>
            <span className="text-gray-400 text-sm">{user.id}</span>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-white mt-2">
        <div className="px-4 py-4 border-b">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">注册时间</span>
            <span className="text-gray-800">
              {new Date(parseInt(user.id)).toLocaleDateString('zh-CN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
