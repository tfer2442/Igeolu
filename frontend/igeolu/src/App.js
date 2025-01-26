// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home'; // Home 컴포넌트 임포트
import ChatButton from './components/common/Button/ChatButton'; // ChatButton 컴포넌트 임포트
import ChatModal from './components/common/ChatModal';

function App() {
  console.log('페이지 초기화!');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
        <ChatButton onClick={toggleModal} />
        {isModalOpen && (
          <ChatModal
            chatRooms={[]}
            onSelectChatRoom={() => {}}
            onClose={toggleModal}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
