// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import ChatButton from './components/common/Button/ChatButton';
import ChatModal from './components/common/ChatModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // 모달 상태 토글
  };

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
        <ChatButton onClick={toggleModal} />

        <ChatModal
          chatRooms={[]}
          onSelectChatRoom={() => {}}
          onClose={toggleModal}
          isModalOpen={isModalOpen} // 상태를 props로 전달
        />
      </div>
    </Router>
  );
}

export default App;
