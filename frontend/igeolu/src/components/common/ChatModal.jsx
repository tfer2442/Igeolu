import React from 'react';
import PropTypes from 'prop-types';
import './ChatModal.css';

const ChatModal = ({ chatRooms, onSelectChatRoom, onClose }) => {
  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal">
        <header className="modal-header">
          <h3>채팅방 목록</h3>
          <button className="close-button" onClick={onClose}>❌</button>
        </header>
        <ul className="chat-room-list">
          {chatRooms.map((room, index) => (
            <li key={index} className="chat-room-item">
              {/* <li> 대신 <button> 사용 */}
              <button
                className="chat-room-button"  // 스타일을 위한 클래스
                onClick={() => onSelectChatRoom(room)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    onSelectChatRoom(room);
                  }
                }}
                tabIndex="0"  // 키보드 접근성 확보
              >
                <div className="room-details">
                  <h4>{room.name}</h4>
                  <p>{room.lastMessage}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

ChatModal.propTypes = {
  chatRooms: PropTypes.array.isRequired,
  onSelectChatRoom: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChatModal;
