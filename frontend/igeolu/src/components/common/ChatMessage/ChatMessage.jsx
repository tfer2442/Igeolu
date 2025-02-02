import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import './ChatMessage.css';

const ChatMessage = ({ message, isCurrentUser }) => {
  const messageTime = format(new Date(message.createdAt), 'HH:mm');

  return (
    <div className={`message-wrapper ${isCurrentUser ? 'message-sent' : 'message-received'}`}>
      <div className="message-content">
        <p className="message-text">{message.content}</p>
        <span className="message-time">{messageTime}</span>
      </div>
    </div>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.shape({
    userId: PropTypes.number.isRequired,
    messageId: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired
  }).isRequired,
  isCurrentUser: PropTypes.bool.isRequired
};

export default ChatMessage;