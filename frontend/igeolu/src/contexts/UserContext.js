// src/contexts/UserContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children, initialUser, onUserChange }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 초기 마운트시 localStorage에서 사용자 정보 가져오기
    const initializeUser = () => {
      // initialUser가 있으면 그것을 사용, 없으면 localStorage 확인
      if (initialUser) {
        setUser(initialUser);
      } else {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }
      setIsLoading(false);
    };

    initializeUser();
  }, [initialUser]);

  // 로그인 핸들러
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (onUserChange) {
      onUserChange(userData);
    }
  };

  // 로그아웃 핸들러
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    if (onUserChange) {
      onUserChange(null);
    }
    window.location.href = 'https://i12d205.p.ssafy.io/api/logout';
  };

  // 사용자 정보 업데이트 핸들러
  const updateUser = (newUserData) => {
    const updatedUser = {
      ...user,
      ...newUserData
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    if (onUserChange) {
      onUserChange(updatedUser);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser,
      login,
      logout,
      updateUser,
      isLoading 
    }}>
      {children}
    </UserContext.Provider>
  );
}

// 커스텀 훅
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}