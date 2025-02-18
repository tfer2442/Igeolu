// src/components/AuthRoutes.js
import { Navigate, useLocation } from 'react-router-dom';

export const PrivateRoute = ({ children, user, isMobile = false }) => {
  const location = useLocation();
  
  if (!user?.userId) {
    // 로그인되지 않은 상태에서 보호된 경로 접근 시
    return <Navigate to={isMobile ? '/mobile-login' : '/login'} state={{ from: location }} replace />;
  }
  
  return children;
};

export const AuthRoute = ({ children, user, isMobile = false }) => {
  if (user?.userId) {
    // 이미 로그인된 상태에서 로그인 페이지 접근 시
    return <Navigate to={isMobile ? '/mobile-main' : '/desktop-main'} replace />;
  }
  
  return children;
};