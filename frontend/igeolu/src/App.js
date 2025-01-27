// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import ChatButton from './components/common/Button/ChatButton';
import ChatModal from './components/common/ChatModal';
import ChatRoom from './components/common/ChatRoom'; // 새로운 채팅방 컴포넌트 임포트

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLeaving, setIsLeaving] = useState(false); // 애니메이션 상태 추가

  const toggleModal = () => {
    if (selectedRoom) {
      // 채팅방이 열려있을 때
      setIsLeaving(true);
      setTimeout(() => {
        setSelectedRoom(null);
        setIsModalOpen(false);
        setIsLeaving(false);
      }, 300);
    } else {
      // 채팅방이 닫혀있을 때
      setIsModalOpen(!isModalOpen);
    }
  };

  const selectRoom = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(false);
  };

  const handleBack = () => {
    setSelectedRoom(null);
    setIsModalOpen(true);
  };

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
        <ChatButton onClick={toggleModal} />
        {!selectedRoom && (
          <ChatModal
            chatRooms={[{ name: 'Room 1' }, { name: 'Room 2' }]}
            onSelectChatRoom={selectRoom}
            onClose={toggleModal}
            isModalOpen={isModalOpen}
          />
        )}

        {selectedRoom && (
          <ChatRoom
            room={selectedRoom}
            onBack={handleBack}
            isLeaving={isLeaving} // isLeaving prop 추가
          />
        )}
      </div>
    </Router>
  );
}

export default App;
