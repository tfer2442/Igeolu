import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div 
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#272626'
      }}
    >
      <Loader2 
        style={{
          width: '48px',
          height: '48px',
          color: 'white',
          marginBottom: '16px',
          animation: 'spin 1s linear infinite'
        }}
      />
      <p style={{ color: 'white', fontSize: '1.125rem' }}>로딩 중...</p>
    </div>
  );
};

// 스피너 애니메이션을 위한 keyframes 스타일
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
document.head.appendChild(style);

export default LoadingSpinner;