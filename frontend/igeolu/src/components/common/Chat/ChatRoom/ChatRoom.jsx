// components/common/Chat/ChatRoom/ChatRoom.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import ChatWebSocket from '../../../../services/webSocket/chatWebSocket';
import chatApi from '../../../../services/chatApi';
import ChatMessage from '../ChatMessage/ChatMessage';
import './ChatRoom.css';

/* 📌 임시 사용자 ID (나중에 로그인 시스템으로 대체 예정) */
const CURRENT_USER_ID = 123456;

/**
 * 📌 ChatRoom 컴포넌트
 * - 특정 채팅방의 메시지를 표시하고 실시간 메시지 송수신 처리
 * - WebSocket을 통해 실시간 업데이트 지원
 * - 메시지 입력 및 전송 기능 포함
 */
const ChatRoom = ({ room, onBack, isMobile }) => {
  /* 📌 상태 관리 */
  const [messages, setMessages] = useState([]); // 채팅 메시지 목록
  const [newMessage, setNewMessage] = useState(''); // 입력 중인 메시지
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [isExtrasOpen, setIsExtrasOpen] = useState(false); // 추가 기능 버튼 상태
  const [error, setError] = useState(null); // 에러 상태
  const chatSocketRef = useRef(null); // WebSocket 참조
  const messagesEndRef = useRef(null); // 메시지 목록 끝 위치 참조

  /* 📌 추가 기능 토글 */
  const toggleExtras = () => {
    setIsExtrasOpen(!isExtrasOpen);
  };

  /* 📌 메시지 목록 스크롤을 최하단으로 이동 */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /* 📌 새로운 메시지를 수신했을 때 상태 업데이트 */
  const handleNewMessage = useCallback((message) => {
    setMessages((prev) => [...prev, message]);
    scrollToBottom();
  }, []);

  /* 📌 기존 메시지 불러오기 */
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

  /* 📌 채팅방 초기화 및 WebSocket 연결 */
  useEffect(() => {
    const initializeChat = async () => {
      try {
        await Promise.all([
          fetchMessages(),
          chatApi.markMessagesAsRead(room.roomId, CURRENT_USER_ID), // 읽음 처리
        ]);

        chatSocketRef.current = new ChatWebSocket(room.roomId, handleNewMessage);
        await chatSocketRef.current.connect();
      } catch (error) {
        setError('채팅 연결에 실패했습니다.');
      }
    };

    initializeChat();

    /* 📌 컴포넌트 언마운트 시 WebSocket 해제 */
    return () => {
      if (chatSocketRef.current) {
        chatSocketRef.current.disconnect();
      }
    };
  }, [room.roomId, fetchMessages, handleNewMessage]);

  /* 📌 메시지 전송 핸들러 */
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

  /* 📌 Enter 키 입력 처리 */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`chat-room ${isMobile ? 'mobile' : ''}`}>
      {/* 📌 채팅방 헤더 */}
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

      {/* 📌 메시지 목록 */}
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

      {/* 📌 메시지 입력창 및 추가 기능 */}
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

        {/* 📌 추가 기능 패널 */}
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

/* 📌 PropTypes 설정 */
ChatRoom.propTypes = {
  room: PropTypes.shape({
    roomId: PropTypes.number.isRequired, // 채팅방 ID
    userName: PropTypes.string.isRequired, // 상대방 이름
    userProfileUrl: PropTypes.string.isRequired, // 상대방 프로필 URL
  }).isRequired,
  onBack: PropTypes.func.isRequired, // 뒤로 가기 버튼 핸들러
  isMobile: PropTypes.bool, // 모바일 여부
};

export default ChatRoom;
