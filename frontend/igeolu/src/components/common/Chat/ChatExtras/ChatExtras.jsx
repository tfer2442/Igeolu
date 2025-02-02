// components/common/Chat/ChatExtras/ChatExtras.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './ChatExtras.css';

const ChatExtras = ({ isOpen }) => {
  return (
    <div className={`chat-extras ${isOpen ? 'open' : ''}`}>
      <div className="chat-extras-content">
        <button className="extra-button">
          <span>파일첨부</span>
        </button>
        <button className="extra-button">
          <span>녹음하기</span>
        </button>
        <button className="extra-button">
          <span>파일첨부</span>
        </button>
      </div>
    </div>
  );
};

ChatExtras.propTypes = {
  isOpen: PropTypes.bool.isRequired
};

export default ChatExtras;