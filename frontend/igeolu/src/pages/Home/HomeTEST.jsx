// src/pages/Home/Home.jsx
import React, { useState } from 'react';
import './Home.css';

const Home = () => {
  // 임시 사용자와 중개사 데이터
  const users = [
    { id: 1, name: "User 1" },
    { id: 2, name: "User 2" },
    { id: 3, name: "User 3" },
    { id: 4, name: "User 4" },
    { id: 5, name: "User 5" }
  ];

  const realtors = [
    { id: 101, name: "Realtor 1" },
    { id: 102, name: "Realtor 2" },
    { id: 103, name: "Realtor 3" },
    { id: 104, name: "Realtor 4" },
    { id: 105, name: "Realtor 5" }
  ];

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRealtor, setSelectedRealtor] = useState(null);

  const handleCreateChat = () => {
    if (!selectedUser || !selectedRealtor) {
      alert('사용자와 중개사를 모두 선택해주세요.');
      return;
    }

    // TODO: 실제 채팅방 생성 API 호출
    console.log('Creating chat room:', {
      memberId: selectedUser.id,
      realtorId: selectedRealtor.id
    });

    // 선택 초기화
    setSelectedUser(null);
    setSelectedRealtor(null);
  };

  return (
    <div className="home-container">
      <h1>채팅방 생성 테스트</h1>
      
      <div className="selection-container">
        <div className="selection-box">
          <h2>사용자 선택</h2>
          <div className="user-list">
            {users.map(user => (
              <button
                key={user.id}
                className={`select-button ${selectedUser?.id === user.id ? 'selected' : ''}`}
                onClick={() => setSelectedUser(user)}
              >
                {user.name}
              </button>
            ))}
          </div>
        </div>

        <div className="selection-box">
          <h2>중개사 선택</h2>
          <div className="realtor-list">
            {realtors.map(realtor => (
              <button
                key={realtor.id}
                className={`select-button ${selectedRealtor?.id === realtor.id ? 'selected' : ''}`}
                onClick={() => setSelectedRealtor(realtor)}
              >
                {realtor.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="selected-info">
        <p>선택된 사용자: {selectedUser?.name || '없음'}</p>
        <p>선택된 중개사: {selectedRealtor?.name || '없음'}</p>
      </div>

      <button 
        className="create-chat-button"
        onClick={handleCreateChat}
        disabled={!selectedUser || !selectedRealtor}
      >
        채팅방 생성
      </button>
    </div>
  );
};

export default Home;