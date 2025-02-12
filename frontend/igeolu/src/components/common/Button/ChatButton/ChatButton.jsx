// src/components/common/Button/ChatButton.jsx
import React from 'react';
import PropTypes from 'prop-types';
import ChatButtonImage from '../../../../assets/images/ChatButtonImage.png';
import './ChatButton.css';

const ChatButton = ({ onClick }) => {
  return (
    <button className="chat-button" onClick={onClick}>
      <img src={ChatButtonImage} alt="Chat" className="chat-button-image" />
    </button>
  );
};

ChatButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default ChatButton;