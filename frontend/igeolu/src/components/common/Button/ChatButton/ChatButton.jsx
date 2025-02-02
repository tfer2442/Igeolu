// src/components/common/Button/ChatButton.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './ChatButton.css';

const ChatButton = ({ onClick }) => {
  return (
    <button className="chat-button" onClick={onClick}>
      💬
    </button>
  );
};

ChatButton.propTypes = {
    onClick: PropTypes.func.isRequired
  };

export default ChatButton;
