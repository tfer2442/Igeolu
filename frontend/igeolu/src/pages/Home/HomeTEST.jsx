import React, { useState, useEffect } from 'react';
import chatApi from '../../services/chatApi';
import ChatRoomsWebSocketService from '../../services/chatRoomsWebSocket';
import './Home.css';

const Home = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRealtor, setSelectedRealtor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);

  // WebSocket 연결 설정
  useEffect(() => {
    const chatRoomsWS = new ChatRoomsWebSocketService((updatedRooms) => {
      setChatRooms(updatedRooms);
    });

    chatRoomsWS.connect();

    return () => {
      chatRoomsWS.disconnect();
    };
  }, []);

  // 임시 데이터
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

  const handleCreateChat = async () => {
    if (!selectedUser || !selectedRealtor) {
      alert('사용자와 중개사를 모두 선택해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await chatApi.createChatRoom(selectedUser.id, selectedRealtor.id);
      console.log('채팅방 생성 성공:', response);
      alert(`채팅방이 생성되었습니다. (Room ID: ${response.roomId})`);
      
      // 채팅방 생성 후 업데이트된 목록은 WebSocket을 통해 자동으로 받게 됨
      
      // 선택 초기화
      setSelectedUser(null);
      setSelectedRealtor(null);
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
      setError('채팅방 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
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
                disabled={isLoading}
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
                disabled={isLoading}
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

      {error && <p className="error-message">{error}</p>}

      <button 
        className="create-chat-button"
        onClick={handleCreateChat}
        disabled={!selectedUser || !selectedRealtor || isLoading}
      >
        {isLoading ? '생성 중...' : '채팅방 생성'}
      </button>

      {chatRooms.length > 0 && (
        <div className="chat-rooms-list">
          <h2>현재 채팅방 목록</h2>
          <ul>
            {chatRooms.map(room => (
              <li key={room.id} className="chat-room-item">
                {room.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;