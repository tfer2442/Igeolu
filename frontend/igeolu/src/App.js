// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home/Home';
import ChatButton from './components/common/Button/ChatButton';
import ChatModal from './components/common/ChatModal';
import ChatRoom from './components/common/ChatRoom';
import MobileChatList from './pages/Mobile/MobileChatList';
import MobileChatRoom from './pages/Mobile/MobileChatRoom';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const location = useLocation();

  const isMobileChatRoute = location.pathname.startsWith('/m/chat');

  const fetchChatRooms = async () => {
    try {
      const response = await axios.get('http://localhost:8080/chatList');
      setChatRooms(response.data);
    } catch (error) {
      console.error('채팅방 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    if (isModalOpen || location.pathname === '/m/chat') {
      fetchChatRooms();
    }
  }, [isModalOpen, location.pathname]);

  const toggleModal = () => {
    if (selectedRoom) {
      setIsLeaving(true);
      setTimeout(() => {
        setSelectedRoom(null);
        setIsModalOpen(false);
        setIsLeaving(false);
      }, 300);
    } else {
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

  const handleUpdateRooms = (updatedRooms) => {
    setChatRooms(updatedRooms);
  };

  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/m/chat" 
          element={
            <MobileChatList 
              chatRooms={chatRooms} 
              onUpdateRooms={handleUpdateRooms}
            />
          } 
        />
        <Route path="/m/chat/:roomId" element={<MobileChatRoom />} />
      </Routes>
      
      {!isMobileChatRoute && (
        <>
          <ChatButton onClick={toggleModal} />
          {!selectedRoom && (
            <ChatModal
              chatRooms={chatRooms}
              onSelectChatRoom={selectRoom}
              onClose={toggleModal}
              isModalOpen={isModalOpen}
            />
          )}
          {selectedRoom && (
            <ChatRoom
              room={selectedRoom}
              onBack={handleBack}
              isLeaving={isLeaving}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;