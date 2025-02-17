import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children, initialUser, onUserChange }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleUserAuthentication = async () => {
      try {
        const response = await fetch(
          'https://i12d205.p.ssafy.io/api/users/me',
          {
            method: 'GET',
            credentials: 'include',
            withCredentials: true,
          }
        );

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        const data = await response.json();

        if (data.userId) {
          const userData = { userId: data.userId, role: data.role };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          if (onUserChange) {
            onUserChange(userData);
          }
        } else {
          localStorage.removeItem('user');
          setUser(null);
          if (onUserChange) {
            onUserChange(null);
          }
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        localStorage.removeItem('user');
        setUser(null);
        if (onUserChange) {
          onUserChange(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    handleUserAuthentication();
  }, [onUserChange]);

  // 로그인 핸들러
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (onUserChange) {
      onUserChange(userData);
    }
  };

  // 로그아웃 핸들러
  const logout = async () => {
    try {
      // 로그아웃 API 호출
      await fetch('https://i12d205.p.ssafy.io/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      if (onUserChange) {
        onUserChange(null);
      }
      window.location.href = '/';
    }
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