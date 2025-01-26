import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './pages/Chat/Chat';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<h1>Home Page</h1>} />
        <Route path='/chat' element={<Chat />} />
      </Routes>
    </Router>
  );
};

export default App;
