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
const ChatRoom = ({ room, onBack, isMobile, currentUserId,
  activeRoomId, onRoomUpdate, isChatRoomOpen }) => {
  // currentUserId props
  /* 📌 상태 관리 */
  const [messages, setMessages] = useState([]); // 채팅 메시지 목록
  const [newMessage, setNewMessage] = useState(''); // 입력 중인 메시지
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [isExtrasOpen, setIsExtrasOpen] = useState(false); // 추가 기능 버튼 상태
  const [error, setError] = useState(null); // 에러 상태
  const chatSocketRef = useRef(null); // WebSocket 참조
  const messagesEndRef = useRef(null); // 메시지 목록 끝 위치 참조

  const isRoomActive = activeRoomId === room.roomId && isChatRoomOpen;


  const LoadingSpinner = isMobile
    ? MobileLoadingSpinner
    : DesktopLoadingSpinner;

  /* 📌 추가 기능 토글 */
  const toggleExtras = () => {
    setIsExtrasOpen(!isExtrasOpen);
  };

  /* 📌 메시지 목록 스크롤을 최하단으로 이동 */
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }, []);

  /* 📌 메시지 읽음 처리 핸들러 */
  const handleMarkAsRead = useCallback(async () => {
    if (!isRoomActive) {
      console.log('ChatRoom: Skipping mark as read - room not active');
      return;
    }

    try {
      await chatApi.markMessagesAsRead(room.roomId, currentUserId);
      console.log('ChatRoom: Messages marked as read');
      await onRoomUpdate(room.roomId);
    } catch (error) {
      console.error('ChatRoom: Failed to mark messages as read:', error);
    }
  }, [room.roomId, currentUserId, isRoomActive, onRoomUpdate]);


  /* 📌 새로운 메시지를 수신했을 때 상태 업데이트 및 조건부 읽음 처리 */
  const handleNewMessage = useCallback(async (message, isActive) => {
    console.log('ChatRoom: New message received:', { message, isActive });
    
    setMessages(prev => {
      const isDuplicate = prev.some(m => 
        m.content === message.content && 
        m.writerId === message.writerId && 
        m.createdAt === message.createdAt
      );
      
      if (isDuplicate) return prev;
      return [...prev, message];
    });

    if (isActive) {
      await handleMarkAsRead();
    }

    scrollToBottom();
  }, [handleMarkAsRead, scrollToBottom]);


  /* 📌 기존 메시지 불러오기 및 읽음 처리 */
  const fetchMessages = useCallback(async () => {
    try {
      const response = await chatApi.getChatMessages(room.roomId);
      setMessages(response || []);

      // 채팅방이 활성화 상태이고 열려있을 때만 읽음 처리
      if (activeRoomId === room.roomId && isChatRoomOpen) {
        await handleMarkAsRead();
      }

      scrollToBottom();
    } catch (error) {
      setError('메시지를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [room.roomId, activeRoomId, isChatRoomOpen, handleMarkAsRead, scrollToBottom]);

   /* 📌 채팅방 초기화 및 WebSocket 연결 */
   useEffect(() => {
    console.log('ChatRoom: Component mounted/updated', {
      roomId: room.roomId,
      isActive: isRoomActive
    });
  
    const initializeChat = async () => {
      try {
        // 이미 존재하는 WebSocket 인스턴스 확인
        if (chatSocketRef.current) {
          // 기존 인스턴스의 구독이 활성화되어 있는지 확인
          if (!chatSocketRef.current.subscription || !chatSocketRef.current.stompClient?.connected) {
            console.log('ChatRoom: Reestablishing WebSocket connection');
            await chatSocketRef.current.connect();
            chatSocketRef.current.subscribeToMessages();
          }
        } else {
          // 새로운 WebSocket 인스턴스 생성 및 연결
          console.log('ChatRoom: Creating new WebSocket instance');
          chatSocketRef.current = new ChatWebSocket(room.roomId, handleNewMessage);
          await chatSocketRef.current.connect();
          chatSocketRef.current.subscribeToMessages();
        }
  
        // 활성화 상태 업데이트
        chatSocketRef.current.setActive(isRoomActive);
  
        // 메시지 로드
        const response = await chatApi.getChatMessages(room.roomId);
        setMessages(response || []);
        
        if (isRoomActive) {
          await handleMarkAsRead();
        }
        
        scrollToBottom();
        setIsLoading(false);
      } catch (error) {
        console.error('ChatRoom: Initialization failed:', error);
        setError('채팅 초기화에 실패했습니다.');
        setIsLoading(false);
      }
    };
  
    initializeChat();
  
    // Cleanup
    return () => {
      console.log('ChatRoom: Component unmounting', {
        roomId: room.roomId,
        isActive: false
      });
      
      if (chatSocketRef.current) {
        chatSocketRef.current.setActive(false);
      }
    };
  }, [room.roomId, isRoomActive, handleNewMessage, handleMarkAsRead, scrollToBottom]);
  /* 📌 메시지 전송 핸들러 */
  const handleSendMessage = async () => {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) return;

    const messageData = {
      roomId: room.roomId,
      userId: currentUserId,
      content: trimmedMessage,
      senderType: "USER",
    };

    try {
      if (!chatSocketRef.current?.isConnected) {
        console.log('WebSocket 재연결 시도');
        await chatSocketRef.current?.connect();
      }

      const sent = chatSocketRef.current?.sendMessage(messageData);
      if (sent) {
        console.log('메시지 전송 성공');
        setNewMessage('');
        
        // 현재 활성화된 채팅방이고 열려있을 때만 읽음 처리
        if (activeRoomId === room.roomId && isChatRoomOpen) {
          await handleMarkAsRead();
        }
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

  /* 📌 뒤로가기 읽은 메세지 마크크 처리 */
  const handleBack = () => {
    onBack();
  };

  /* 📌 시스템 메세지 전송 함수 */
  const sendSystemMessage = async (content) => {
    const messageData = {
      roomId: room.roomId,
      userId: currentUserId,
      content: content,
      senderType: "SYSTEM",
    };
  
    try {
      if (!chatSocketRef.current?.isConnected) {
        console.log('WebSocket 재연결 시도');
        await chatSocketRef.current?.connect();
      }
  
      const sent = chatSocketRef.current?.sendMessage(messageData);
      if (sent) {
        console.log('시스템 메시지 전송 성공');
        // 읽음 처리를 확실히 하기 위해 약간의 지연 추가
        setTimeout(async () => {
          if (activeRoomId === room.roomId && isChatRoomOpen) {
            try {
              await handleMarkAsRead();
              await onRoomUpdate(room.roomId);  // roomUpdate 추가
            } catch (error) {
              console.error('Failed to mark system message as read:', error);
            }
          }
        }, 100);
      } else {
        setError('메시지 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('WebSocket 메시지 전송 중 오류 발생:', error);
      setError('메시지 전송에 실패했습니다.');
    }
  };

  return (
    <div className={`chat-room ${isMobile ? 'mobile' : ''}`}>
      {/* 📌 채팅방 헤더 */}
      <header className='chat-room-header'>
        <button
          onClick={handleBack}
          className='chat-back-button'
          aria-label='채팅방 목록으로 돌아가기'
        >
          ←
        </button>
        <h2 className='chat-room-title'>{room.userName}</h2>
      </header>

      {/* 📌 메시지 목록 */}
      <div
        className={`chat-input-wrapper ${isExtrasOpen ? 'extras-open' : ''}`}
      >
        <div className='messages-container'>
          {isLoading ? (
            <LoadingSpinner
              size='medium'
              fullScreen={false}
              backgroundColor='transparent'
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
            maxLength={1000}
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
          sendSystemMessage={sendSystemMessage}
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
  activeRoomId: PropTypes.number,
  onRoomUpdate: PropTypes.func.isRequired,
};

export default ChatRoom;
