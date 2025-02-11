
import React from 'react';
import { Home, User } from 'lucide-react';
import './MenuButtons.css';

const MenuButtons = ({ onMenuClick, activeMenu }) => {
  return (
    <div className="menu-buttons-container">
      <button 
        className={`menu-button ${activeMenu === 'room' ? 'active' : ''}`}
        onClick={() => onMenuClick('room')}
      >
        <Home size={24} />
        <span className="menu-button-text">원룸</span>
      </button>
      <button 
        className={`menu-button ${activeMenu === 'agent' ? 'active' : ''}`}
        onClick={() => onMenuClick('agent')}
      >
        <User size={24} />
        <span className="menu-button-text">공인중개사</span>
      </button>
    </div>
  );
};

export default MenuButtons;