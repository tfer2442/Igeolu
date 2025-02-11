// components/common/Chat/ChatRoom/ChatRoom.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import ChatWebSocket from '../../../../services/webSocket/chatWebSocket';
import chatApi from '../../../../services/ChatApi';
import ChatMessage from '../ChatMessage/ChatMessage';
import ChatExtras from '../ChatExtras/ChatExtras';
import './ChatRoom.css';
import DesktopLoadingSpinner from '../../../LoadingSpinner/DesktopLoadingSpinner';
import MobileLoadingSpinner from '../../../LoadingSpinner/MobileLoadingSpinner';

/**
 * 📌 ChatRoom 컴포넌트
 * - 특정 채팅방의 메시지를 표시하고 실시간 메시지 송수신 처리
 * - WebSocket을 통해 실시간 업데이트 지원
 * - 메시지 입력 및 전송 기능 포함
 */
const ChatRoom = ({ room, onBack, isMobile, currentUserId }) => {
  // currentUserId props
  /* 📌 상태 관리 */
  const [messages, setMessages] = useState([]); // 채팅 메시지 목록
  const [newMessage, setNewMessage] = useState(''); // 입력 중인 메시지
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [isExtrasOpen, setIsExtrasOpen] = useState(false); // 추가 기능 버튼 상태
  const [error, setError] = useState(null); // 에러 상태
  const chatSocketRef = useRef(null); // WebSocket 참조
  const messagesEndRef = useRef(null); // 메시지 목록 끝 위치 참조

  const LoadingSpinner = isMobile ? MobileLoadingSpinner : DesktopLoadingSpinner;

  /* 📌 추가 기능 토글 */
  const toggleExtras = () => {
    setIsExtrasOpen(!isExtrasOpen);
  };

  /* 📌 메시지 목록 스크롤을 최하단으로 이동 */
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }, 50);
  }, []);

  /* 📌 새로운 메시지를 수신했을 때 상태 업데이트 */
  // 1. useCallback으로 함수들을 메모이제이션
  const handleNewMessage = useCallback((message) => {
    setMessages((prev) => {
      const isDuplicate = prev.some(
        (m) =>
          m.content === message.content &&
          m.writerId === message.writerId &&
          m.createdAt === message.createdAt
      );

      if (isDuplicate) return prev;
      return [...prev, message];
    });

    scrollToBottom();
  }, []); // scrollToBottom만 의존성으로 필요

  /* 📌 기존 메시지 불러오기 */
  const fetchMessages = useCallback(async () => {
    try {
      const response = await chatApi.getChatMessages(room.roomId);
      setMessages(response || []);

      // 2. 메시지를 성공적으로 불러온 후 읽음 처리를 합니다
      try {
        await chatApi.markMessagesAsRead(room.roomId, currentUserId);
      } catch (markError) {
        // 읽음 처리 실패는 사용자 경험에 크게 영향을 주지 않으므로
        // 조용히 에러 로깅만 합니다
        console.error('메시지 읽음 처리 실패:', markError);
      }

      scrollToBottom();
    } catch (error) {
      setError('메시지를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [room.roomId, scrollToBottom]);

  /* 📌 채팅방 초기화 및 WebSocket 연결 */
  useEffect(() => {
    let isSubscribed = true;
    const wsRef = chatSocketRef.current;

    const initializeChat = async () => {
      try {
        if (wsRef) {
          wsRef.disconnect();
        }

        chatSocketRef.current = new ChatWebSocket(
          room.roomId,
          handleNewMessage
        );

        await chatSocketRef.current.connect();

        if (!isSubscribed) return;

        await fetchMessages();
      } catch (error) {
        if (!isSubscribed) return;
        setError('채팅 초기화에 실패했습니다.');
      }
    };

    initializeChat();

    // cleanup 함수
    return () => {
      isSubscribed = false;
      if (wsRef) {
        wsRef.disconnect();
      }
    };
  }, [room.roomId]); // room.roomId만 의존성으로 사용

  /* 📌 메시지 전송 핸들러 */
  const handleSendMessage = async () => {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) return;

    const messageData = {
      roomId: room.roomId,
      userId: currentUserId,
      content: trimmedMessage,
    };

    try {
      if (!chatSocketRef.current?.isConnected) {
        console.log('WebSocket 재연결 시도');
        await chatSocketRef.current?.connect();
      }

      const sent = chatSocketRef.current?.sendMessage(messageData);
      if (sent) {
        console.log('메시지 전송 성공');
        setNewMessage(''); // 입력창만 비우기
      } else {
        setError('메시지 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('WebSocket 메시지 전송 중 오류 발생:', error);
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
          className='chat-back-button'
          aria-label='채팅방 목록으로 돌아가기'
        >
          ←
        </button>
        <h2 className='chat-room-title'>{room.userName}</h2>
      </header>

      {/* 📌 메시지 목록 */}
      <div className={`chat-input-wrapper ${isExtrasOpen ? 'extras-open' : ''}`}>
        <div className='messages-container'>
        {isLoading ? (
            <LoadingSpinner 
              size="medium"
              fullScreen={false}
              backgroundColor="transparent"
              showText={false}
            />
          ) : error ? (
            <div className='error-state'>
              {error}
              <button onClick={fetchMessages} className='retry-button'>
                다시 시도
              </button>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <ChatMessage
                  key={`${message.roomId}-${message.writerId}-${index}`}
                  message={{
                    userId: message.writerId, // writerId를 userId로 변환
                    content: message.content,
                    createdAt: message.createdAt,
                  }}
                  isCurrentUser={message.writerId === currentUserId}
                  userProfile={
                    message.writerId !== currentUserId
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
        <ChatExtras
          isOpen={isExtrasOpen}
          room={room}
          currentUserId={currentUserId}
          onClose={() => setIsExtrasOpen(false)}
          onAppointmentCreate
        />
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
  currentUserId: PropTypes.number.isRequired, // PropTypes 추가
};

export default ChatRoom;
