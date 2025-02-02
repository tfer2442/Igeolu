import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import ChatWebSocketService from '../../services/chatWebSocket';
import chatApi from '../../services/chatApi';
import ChatMessage from './ChatMessage/ChatMessage';
import './ChatRoom.css';

const CURRENT_USER_ID = 123; // 실제 구현시 인증 시스템에서 가져와야 함

const ChatRoom = ({ room, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const webSocketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = useCallback(async () => {
    try {
      const fetchedMessages = await chatApi.getChatMessages(room.roomId);
      setMessages(fetchedMessages);
      scrollToBottom();
    } catch (error) {
      setError('메시지를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [room.roomId]);

  useEffect(() => {
    const setupChat = async () => {
      await fetchMessages();

      webSocketRef.current = new ChatWebSocketService(
        room.roomId,
        (message) => {
          setMessages(prev => [...prev, message]);
          scrollToBottom();
        }
      );
      await webSocketRef.current.connect();
    };

    setupChat();

    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.disconnect();
      }
    };
  }, [room.roomId, fetchMessages]);

  const handleSendMessage = () => {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) return;

    const messageData = {
      roomId: room.roomId,
      userId: CURRENT_USER_ID,
      content: trimmedMessage
    };

    webSocketRef.current?.sendMessage(messageData);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-room">
      <header className="chat-room-header">
        <button 
          onClick={onBack} 
          className="back-button"
          aria-label="채팅방 목록으로 돌아가기"
        >
          ←
        </button>
        <h2 className="chat-room-title">{room.userName}</h2>
      </header>

      <div className="messages-container">
        {isLoading ? (
          <div className="loading-state">메시지를 불러오는 중...</div>
        ) : error ? (
          <div className="error-state">
            {error}
            <button onClick={fetchMessages} className="retry-button">
              다시 시도
            </button>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.messageId}
                message={message}
                isCurrentUser={message.userId === CURRENT_USER_ID}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="message-input-container">
        <textarea
          className="message-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요..."
          rows={1}
        />
        <button 
          onClick={handleSendMessage} 
          className="send-button"
          disabled={!newMessage.trim()}
        >
          전송
        </button>
      </div>
    </div>
  );
};

ChatRoom.propTypes = {
  room: PropTypes.shape({
    roomId: PropTypes.number.isRequired,
    userName: PropTypes.string.isRequired
  }).isRequired,
  onBack: PropTypes.func.isRequired
};

export default ChatRoom;