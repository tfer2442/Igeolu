// src/pages/DesktopMyPage/DesktopMyPage.jsx
import React, { useState } from 'react';
import MyPageModal from '../../components/MyPageModal/MyPageModal';

const DesktopMyPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      {/* 기존 코드는 그대로 유지 */}
      
      {/* 모달 열기 버튼 */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        모달 열기
      </button>

      {/* 모달 컴포넌트 */}
      {isModalOpen && <MyPageModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default DesktopMyPage;