// src/components/layout/Sidebar/Sidebar.jsx
import React, { useState } from 'react';
import PropertyList from './PropertyList';
import './Sidebar.css';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('원룸');
  const [filters, setFilters] = useState({
    monthlyRent: false,
    deposit: false,
    furnished: false
  });

  return (
    <div className="sidebar">
      <div className="tab-container">
        <button 
          className={`tab ${activeTab === '원룸' ? 'active' : ''}`}
          onClick={() => setActiveTab('원룸')}
        >
          원룸/투룸
        </button>
        <button 
          className={`tab ${activeTab === '중개사' ? 'active' : ''}`}
          onClick={() => setActiveTab('중개사')}
        >
          공인중개사
        </button>
      </div>

      <div className="filter-section">
        <div className="room-type-buttons">
          <button className="room-type active">원룸</button>
          <button className="room-type">투룸</button>
        </div>
        <div className="filter-options">
          <label className="filter-option">
            <input 
              type="checkbox" 
              checked={filters.monthlyRent}
              onChange={(e) => setFilters({...filters, monthlyRent: e.target.checked})}
            />
            월세
          </label>
          <label className="filter-option">
            <input 
              type="checkbox"
              checked={filters.deposit}
              onChange={(e) => setFilters({...filters, deposit: e.target.checked})}
            />
            전세
          </label>
          <label className="filter-option">
            <input 
              type="checkbox"
              checked={filters.furnished}
              onChange={(e) => setFilters({...filters, furnished: e.target.checked})}
            />
            풀옵션
          </label>
        </div>
      </div>

      <PropertyList />
    </div>
  );
};

export default Sidebar;