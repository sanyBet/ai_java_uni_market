import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, nickname: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (nickname: string, avatar: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // 从 localStorage 加载用户信息
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // 从 localStorage 获取所有用户
    const usersData = localStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];

    // 查找匹配的用户
    const foundUser = users.find(
      (u: any) => u.username === username && u.password === password
    );

    if (foundUser) {
      const userInfo: User = {
        id: foundUser.id,
        username: foundUser.username,
        nickname: foundUser.nickname,
        avatar: foundUser.avatar,
      };
      setUser(userInfo);
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      return true;
    }

    return false;
  };

  const register = async (
    username: string,
    password: string,
    nickname: string
  ): Promise<boolean> => {
    // 获取现有用户
    const usersData = localStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];

    // 检查用户名是否已存在
    if (users.some((u: any) => u.username === username)) {
      return false;
    }

    // 创建新用户
    const newUser = {
      id: Date.now().toString(),
      username,
      password,
      nickname: nickname || username,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // 自动登录
    const userInfo: User = {
      id: newUser.id,
      username: newUser.username,
      nickname: newUser.nickname,
      avatar: newUser.avatar,
    };
    setUser(userInfo);
    localStorage.setItem('currentUser', JSON.stringify(userInfo));

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (nickname: string, avatar: string) => {
    if (!user) return;

    const updatedUser = { ...user, nickname, avatar };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // 更新 users 列表中的用户信息
    const usersData = localStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];
    const updatedUsers = users.map((u: any) =>
      u.id === user.id ? { ...u, nickname, avatar } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
