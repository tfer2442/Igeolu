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
import { LogOut } from 'lucide-react'; // lucide-react 아이콘 import
import { useUser } from '../../../../contexts/UserContext';

/**
 * 📌 ChatRoom 컴포넌트
 * - 특정 채팅방의 메시지를 표시하고 실시간 메시지 송수신 처리
 * - WebSocket을 통해 실시간 업데이트 지원
 * - 메시지 입력 및 전송 기능 포함
 */
const ChatRoom = ({
  room,
  onBack,
  isMobile,
  currentUserId,
  activeRoomId,
  onRoomUpdate,
  isChatRoomOpen,
  onRoomExit,
}) => {
  const { user } = useUser();  // UserContext 사용

  // currentUserId props
  /* 📌 상태 관리 */
  const [messages, setMessages] = useState([]); // 채팅 메시지 목록
  const [newMessage, setNewMessage] = useState(''); // 입력 중인 메시지
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [isExtrasOpen, setIsExtrasOpen] = useState(false); // 추가 기능 버튼 상태
  const [error, setError] = useState(null); // 에러 상태
  const chatSocketRef = useRef(null); // WebSocket 참조
  const messagesEndRef = useRef(null); // 메시지 목록 끝 위치 참조
  const [showExitModal, setShowExitModal] = useState(false);
  const [myName, setMyName] = useState('');
  const [messageLength, setMessageLength] = useState(0);
  const [showLengthWarning, setShowLengthWarning] = useState(false);

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
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }, 50);
  }, []);

  // handleChange 함수 수정
const handleMessageChange = (e) => {
  const text = e.target.value;
  setNewMessage(text);
  setMessageLength(text.length);
  
  // 900자 이상일 때 경고 표시
  setShowLengthWarning(text.length >= 900);
};

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
  const handleNewMessage = useCallback(
    async (message, isActive) => {
      console.log('ChatRoom: New message received:', { message, isActive });

      setMessages((prev) => {
        const isDuplicate = prev.some(
          (m) =>
            m.content === message.content &&
            m.writerId === message.writerId &&
            m.createdAt === message.createdAt &&
            m.senderType === message.senderType
        );

        if (isDuplicate) return prev;
        return [...prev, message];
      });

      if (isActive) {
        await handleMarkAsRead();
      }

      scrollToBottom();
    },
    [handleMarkAsRead, scrollToBottom]
  );

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
  }, [
    room.roomId,
    activeRoomId,
    isChatRoomOpen,
    handleMarkAsRead,
    scrollToBottom,
  ]);

  /* 📌 채팅방 초기화 및 WebSocket 연결 */
  useEffect(() => {
    console.log('[시작] ChatRoom 컴포넌트 마운트/업데이트', {
      time: new Date().toISOString(),
      roomId: room.roomId,
      isActive: isRoomActive,
    });

    const initializeChat = async () => {
      const startTime = performance.now();
      try {
        // 이미 존재하는 WebSocket 인스턴스 확인
        if (chatSocketRef.current) {
          console.log('[WebSocket] 기존 WebSocket 인스턴스 확인', {
            time: new Date().toISOString(),
            elapsed: performance.now() - startTime,
          });

          // 기존 인스턴스의 구독이 활성화되어 있는지 확인
          if (
            !chatSocketRef.current.subscription ||
            !chatSocketRef.current.stompClient?.connected
          ) {
            console.log('[WebSocket] 재연결 시작', {
              time: new Date().toISOString(),
              elapsed: performance.now() - startTime,
            });

            await chatSocketRef.current.connect();
            console.log('[WebSocket] 재연결 완료', {
              time: new Date().toISOString(),
              elapsed: performance.now() - startTime,
            });

            chatSocketRef.current.subscribeToMessages();
            console.log('[WebSocket] 메시지 구독 완료', {
              time: new Date().toISOString(),
              elapsed: performance.now() - startTime,
            });
          }
        } else {
          console.log('[WebSocket] 새 WebSocket 인스턴스 생성 시작', {
            time: new Date().toISOString(),
            elapsed: performance.now() - startTime,
          });

          chatSocketRef.current = new ChatWebSocket(
            room.roomId,
            handleNewMessage
          );
          await chatSocketRef.current.connect();
          console.log('[WebSocket] 새 연결 완료', {
            time: new Date().toISOString(),
            elapsed: performance.now() - startTime,
          });

          chatSocketRef.current.subscribeToMessages();
          console.log('[WebSocket] 새 메시지 구독 완료', {
            time: new Date().toISOString(),
            elapsed: performance.now() - startTime,
          });
        }

        chatSocketRef.current.setActive(isRoomActive);

        console.log('[API] 메시지 로드 시작', {
          time: new Date().toISOString(),
          elapsed: performance.now() - startTime,
        });

        // 메시지 로드
        const response = await chatApi.getChatMessages(room.roomId);
        console.log('[API] 메시지 로드 완료', {
          time: new Date().toISOString(),
          elapsed: performance.now() - startTime,
          messageCount: response?.length,
        });

        setMessages(response || []);

        if (isRoomActive) {
          console.log('[API] 읽음 처리 시작', {
            time: new Date().toISOString(),
            elapsed: performance.now() - startTime,
          });

          await handleMarkAsRead();
          console.log('[API] 읽음 처리 완료', {
            time: new Date().toISOString(),
            elapsed: performance.now() - startTime,
          });
        }

        scrollToBottom();
        setIsLoading(false);

        console.log('[완료] 채팅방 초기화 완료', {
          time: new Date().toISOString(),
          totalElapsed: performance.now() - startTime,
        });
      } catch (error) {
        console.error('[에러] 채팅방 초기화 실패:', {
          error,
          time: new Date().toISOString(),
          elapsed: performance.now() - startTime,
        });
        setError('채팅 초기화에 실패했습니다.');
        setIsLoading(false);
      }
    };

    initializeChat();

    // Cleanup
    return () => {
      console.log('[정리] ChatRoom 컴포넌트 언마운트', {
        time: new Date().toISOString(),
        roomId: room.roomId,
        isActive: false,
      });

      if (chatSocketRef.current) {
        chatSocketRef.current.setActive(false);
      }
    };
  }, [
    room.roomId,
    isRoomActive,
    handleNewMessage,
    handleMarkAsRead,
    scrollToBottom,
  ]);

  const handleExitRoom = () => {
    setShowExitModal(true);
  };

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser?.name) {
      setMyName(currentUser.name);
    }
  }, []);

  const handleConfirmExit = async () => {
    try {
      await chatApi.exitChatRoom(room.roomId);
      setShowExitModal(false);
      onRoomExit(); 
    } catch (error) {
      console.error('채팅방 나가기 실패:', error);
      setError('채팅방 나가기에 실패했습니다.');
    }
  };

  /* 📌 메시지 전송 핸들러 */
  const handleSendMessage = async () => {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) return;

    const messageData = {
      roomId: room.roomId,
      userId: currentUserId,
      content: trimmedMessage,
      senderType: 'USER',
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
      senderType: 'SYSTEM',
    };

    try {
      if (!chatSocketRef.current?.isConnected) {
        console.log('WebSocket 재연결 시도');
        await chatSocketRef.current?.connect();
      }

      const sent = chatSocketRef.current?.sendMessage(messageData);
      if (sent) {
        console.log('시스템 메시지 전송 성공');
        // 일반 메시지와 동일한 방식으로 처리
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
        <button
          onClick={handleExitRoom}
          className='chat-exit-button'
          aria-label='채팅방 나가기'
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* 나가기 확인 모달 */}
      {showExitModal && (
        <div className='chatroom-modal-overlay'>
          <div className='chatroom-modal-content'>
            <p>채팅방을 나가시겠습니까?</p>
            <div className='chatroom-modal-buttons'>
              <button
                onClick={handleConfirmExit}
                className='chatroom-modal-button confirm'
              >
                예
              </button>
              <button
                onClick={() => setShowExitModal(false)}
                className='chatroom-modal-button cancel'
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}

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
              {/* 환영 메시지 */}
              <div className='welcome-message'>
        <ChatMessage
          message={{
            userId: 0,
            content: `✨ 환영합니다 ${user.role === 'ROLE_REALTOR' ? '중개인' : '세입자'}님! ✨`,
            createdAt: new Date().toISOString(),
            senderType: 'SYSTEM',
          }}
          isCurrentUser={false}
          userProfile={null}
        />
      </div>

              {/* 실제 메시지 목록 */}
              {messages.map((message, index) => (
                <ChatMessage
                  key={`${message.roomId}-${message.writerId}-${index}`}
                  message={{
                    userId: message.writerId,
                    content: message.content,
                    createdAt: message.createdAt,
                    senderType: message.senderType,
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
  {messageLength > 1000 && (
    <div className="character-limit-warning">
      문자수가 너무 깁니다 (최대 1000자)
    </div>
  )}
  <textarea
    className='message-input'
    value={newMessage}
    onChange={(e) => {
      setNewMessage(e.target.value);
      setMessageLength(e.target.value.length);
    }}
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
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      roomId: PropTypes.number.isRequired,
      writerId: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      senderType: PropTypes.oneOf(['USER', 'SYSTEM']).isRequired,
    })
  ),
  onRoomExit: PropTypes.func.isRequired,
};

export default ChatRoom;
