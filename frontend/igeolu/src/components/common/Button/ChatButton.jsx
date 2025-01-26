// src/components/common/Button/ChatButton.jsx
import React from 'react';
import PropTypes from 'prop-types'; // PropTypes를 임포트합니다.
import './ChatButton.css'; // 스타일 파일도 함께 생성해주세요.

const ChatButton = ({ onClick }) => {
  return (
    <button className="chat-button" onClick={onClick}>
      💬
    </button>
  );
};

// PropTypes로 onClick prop의 타입을 검증합니다.
ChatButton.propTypes = {
    onClick: PropTypes.func.isRequired
  };

export default ChatButton;
