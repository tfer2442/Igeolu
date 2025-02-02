// components/common/Chat/ChatRoom/ChatRoom.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import ChatWebSocket from '../../../../services/webSocket/chatWebSocket';
import chatApi from '../../../../services/chatApi';
import ChatMessage from '../ChatMessage/ChatMessage';
import './ChatRoom.css';

// 상수는 나중에 constants 파일로 분리
const CURRENT_USER_ID = 123456; // 임시 사용자 ID -> 나중에 로그인 대체

const ChatRoom = ({ room, onBack, isMobile }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isExtrasOpen, setIsExtrasOpen] = useState(false);
  const [error, setError] = useState(null);
  const chatSocketRef = useRef(null);
  const messagesEndRef = useRef(null);
  

  const toggleExtras = () => {
    setIsExtrasOpen(!isExtrasOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewMessage = useCallback((message) => {
    setMessages((prev) => [...prev, message]);
    scrollToBottom();
  }, []);

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
    const initializeChat = async () => {
      try {
        await Promise.all([
          fetchMessages(),
          chatApi.markMessagesAsRead(room.roomId, CURRENT_USER_ID), // 읽음 처리
        ]);
        chatSocketRef.current = new ChatWebSocket(
          room.roomId,
          handleNewMessage
        );
        await chatSocketRef.current.connect();
      } catch (error) {
        setError('채팅 연결에 실패했습니다.');
      }
    };

    initializeChat();

    return () => {
      if (chatSocketRef.current) {
        chatSocketRef.current.disconnect();
      }
    };
  }, [room.roomId, fetchMessages, handleNewMessage]);

  const handleSendMessage = async () => {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) return;

    const messageData = {
      roomId: room.roomId,
      userId: CURRENT_USER_ID,
      content: trimmedMessage,
    };

    try {
      await chatApi.sendMessage(room.roomId, CURRENT_USER_ID, trimmedMessage);
      chatSocketRef.current?.sendMessage(messageData);
      setNewMessage('');
    } catch (error) {
      setError('메시지 전송에 실패했습니다.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`chat-room ${isMobile ? 'mobile' : ''}`}>
      <header className='chat-room-header'>
        <button
          onClick={onBack}
          className='back-button'
          aria-label='채팅방 목록으로 돌아가기'
        >
          ←
        </button>
        <h2 className='chat-room-title'>{room.userName}</h2>
      </header>

      <div className='messages-container'>
        {isLoading ? (
          <div className='loading-state'>메시지를 불러오는 중...</div>
        ) : error ? (
          <div className='error-state'>
            {error}
            <button onClick={fetchMessages} className='retry-button'>
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
                userProfile={
                  message.userId !== CURRENT_USER_ID
                    ? {
                        // !isCurrentUser 대신 직접 비교
                        userName: room.userName,
                        profileUrl: room.userProfileUrl,
                      }
                    : null
                }
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className={`input-wrapper ${isExtrasOpen ? 'extras-open' : ''}`}>
        <div className='message-input-container'>
          <button
            className='extras-toggle-button'
            onClick={toggleExtras}
            aria-label={isExtrasOpen ? '추가 기능 닫기' : '추가 기능 열기'}
          >
            {isExtrasOpen ? '✕' : '+'}
          </button>
          <textarea
            className='message-input'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            className='send-button'
            disabled={!newMessage.trim()}
            aria-label='메시지 전송'
          />
        </div>
        {isExtrasOpen && (
        <div className="chat-extras">
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
      )}
      </div>
    </div>
  );
};

ChatRoom.propTypes = {
  room: PropTypes.shape({
    roomId: PropTypes.number.isRequired,
    userName: PropTypes.string.isRequired,
    userProfileUrl: PropTypes.string.isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  isMobile: PropTypes.bool
};

export default ChatRoom;
