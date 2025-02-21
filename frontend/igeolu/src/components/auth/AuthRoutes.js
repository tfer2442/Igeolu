// src/components/AuthRoutes.js
import { Navigate, useLocation } from 'react-router-dom';

export const PrivateRoute = ({ children, user, isUserInitialized, isMobile = false }) => {
  const location = useLocation();
  
  // 사용자 정보 로딩 중에는 리다이렉트하지 않음
  if (!isUserInitialized) {
    return null; // 또는 로딩 컴포넌트를 보여줄 수 있습니다
  }

  if (!user?.userId) {
    return <Navigate to={isMobile ? '/mobile-login' : '/login'} state={{ from: location }} replace />;
  }
  
  return children;
};

export const AuthRoute = ({ children, user, isUserInitialized, isMobile = false }) => {
  // 사용자 정보 로딩 중에는 리다이렉트하지 않음
  if (!isUserInitialized) {
    return null; // 또는 로딩 컴포넌트를 보여줄 수 있습니다
  }

  if (user?.userId) {
    return <Navigate to={isMobile ? '/mobile-main' : '/desktop-main'} replace />;
  }
  
  return children;
};