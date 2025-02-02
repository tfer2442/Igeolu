import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';

// Page Components
import Home from './pages/Home/Home';
import MobileChatList from './pages/Mobile/MobileChatList';
import MobileChatRoom from './pages/Mobile/MobileChatRoom';

// Common Components
import ChatButton from './components/common/Button/ChatButton';
import ChatModal from './components/common/ChatModal';
import ChatRoom from './components/common/ChatRoom';
import SlideLayout from './components/common/SlideLayout';

// Constants
const API_BASE_URL = 'http://localhost:8080';

function App() {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  
  // Hooks
  const location = useLocation();
  const isMobileChatRoute = location.pathname.startsWith('/m/chat');

  // API Calls
  const fetchChatRooms = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chatList`);
      setChatRooms(response.data);
    } catch (error) {
      console.error('채팅방 목록 조회 실패:', error);
    }
  }, []);

  useEffect(() => {
    if (isOpen || location.pathname === '/m/chat') {
      fetchChatRooms();
    }
  }, [isOpen, location.pathname, fetchChatRooms]);

  // Event Handlers
  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
  };

  const handleBack = () => {
    setSelectedRoom(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedRoom(null);
  };

  // Render Methods
  const renderChatInterface = () => {
    if (isMobileChatRoute) return null;

    return (
      <>
        <ChatButton onClick={handleToggleChat} />
        <SlideLayout isOpen={isOpen} onClose={handleClose}>
          {!selectedRoom ? (
            <ChatModal
              chatRooms={chatRooms}
              onSelectChatRoom={handleSelectRoom}
              onClose={handleClose}
              isModalOpen={true}
            />
          ) : (
            <ChatRoom
              room={selectedRoom}
              onBack={handleBack}
            />
          )}
        </SlideLayout>
      </>
    );
  };

  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/m/chat" 
          element={<MobileChatList chatRooms={chatRooms} />} 
        />
        <Route 
          path="/m/chat/:roomId" 
          element={<MobileChatRoom />} 
        />
      </Routes>
      {renderChatInterface()}
    </div>
  );
}

export default App;