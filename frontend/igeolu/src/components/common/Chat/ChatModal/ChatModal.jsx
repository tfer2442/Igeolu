// components/common/Chat/ChatModal/ChatModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ChatRoomsWebSocket from '../../../../services/webSocket/chatRoomsWebSocket';
import chatApi from '../../../../services/chatApi';
import ChatRoomList from '../ChatRoomList/ChatRoomList';
import './ChatModal.css';

/* 📌 테스트용 사용자 ID (실제 로그인 기능으로 대체 예정) */
const TEST_USER_ID = 5;

/**
 * 📌 ChatModal 컴포넌트
 * - 채팅방 목록을 모달 형식으로 표시
 * - WebSocket을 통해 채팅방 리스트 실시간 업데이트
 * - 채팅방을 선택하면 `onSelectChatRoom` 콜백 실행
 */
const ChatModal = ({ isModalOpen, onSelectChatRoom, onClose }) => {
  /* 📌 상태 관리 */
  const [chatRooms, setChatRooms] = useState([]); // 채팅방 목록
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const roomsSocketRef = useRef(null); // WebSocket 참조

  /* 📌 실시간 채팅방 목록 업데이트 핸들러 */
  const handleRoomsUpdate = (updatedRooms) => {
    setChatRooms(prev => {
      // 기존 목록과 업데이트된 목록 병합
      const mergedRooms = [...prev];
      updatedRooms.forEach(newRoom => {
        const index = mergedRooms.findIndex(r => r.roomId === newRoom.roomId);
        if (index > -1) {
          mergedRooms[index] = { ...mergedRooms[index], ...newRoom };
        } else {
          mergedRooms.unshift(newRoom);
        }
      });
      return mergedRooms;
    });
  };

  /* 📌 채팅방 목록 불러오기 */
  const fetchChatRooms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await chatApi.getChatRooms(TEST_USER_ID);
      setChatRooms(response);
    } catch (error) {
      setError('채팅방 목록을 불러오는데 실패했습니다.');
      console.error('채팅방 목록 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /* 📌 재연결 로직 */
  // const reconnectWebSocket = async () => {
  //   try {
  //     if (roomsSocketRef.current) {
  //       await roomsSocketRef.current.connect();
  //       await fetchChatRooms(); // 재연결 후 데이터 새로 로드
  //     }
  //     setError(null);
  //   } catch (error) {
  //     setError('채팅 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
  //   }
  // };

  /* 📌 모달이 열릴 때 WebSocket 연결 및 데이터 로드 */
  useEffect(() => {
    const initializeRoomsSocket = async () => {
      if (isModalOpen) {
        try {
          console.log('채팅방 목록 로드 시작');
          await fetchChatRooms();
          console.log('채팅방 목록 로드 완료');
  
          console.log('WebSocket 연결 상태 확인:', {
            hasSocket: !!roomsSocketRef.current,
            isConnected: roomsSocketRef.current?.isConnected
          });
  
          if (!roomsSocketRef.current || !roomsSocketRef.current.isConnected) {
            console.log('새 WebSocket 연결 시도 - userId:', TEST_USER_ID);
            roomsSocketRef.current = new ChatRoomsWebSocket(
              TEST_USER_ID,
              handleRoomsUpdate
            );
  
            try {
              await roomsSocketRef.current.connect();
              console.log('WebSocket 연결 성공');
            } catch (wsError) {
              console.error('WebSocket 연결 실패:', {
                error: wsError,
                socketState: roomsSocketRef.current?.stompClient?.connected,
                socketUrl: roomsSocketRef.current?.SOCKET_URL
              });
              throw wsError;
            }
          }
        } catch (error) {
          console.error('초기화 실패 상세 정보:', {
            error,
            type: error.type,
            message: error.message,
            stack: error.stack
          });
          setError('실시간 업데이트 연결에 실패했습니다.');
        }
      } else {
        console.log('모달이 닫혀있어 초기화 생략');
      }
    };

    initializeRoomsSocket();

    /* 📌 모달이 닫힐 때 WebSocket 연결 해제 */
    return () => {
      if (roomsSocketRef.current) {
        console.log('WebSocket 연결 해제');
        roomsSocketRef.current.disconnect();
        roomsSocketRef.current = null;
      }
    };
  }, [isModalOpen]);

  return (
    <div className={`chat-modal ${isModalOpen ? 'active' : ''}`}>
      {/* 📌 모달 헤더 */}
      <header className='modal-header'>
        <h1 className="modal-title">채팅방 목록</h1>
        <button 
          className="close-button" 
          onClick={onClose}
          aria-label="채팅창 닫기"
        >
          ✕
        </button>
      </header>

      {/* 📌 모달 본문 */}
      <div className='modal-content'>
        {isLoading ? (
          <div className='loading-state'>로딩 중...</div>
        ) : error ? (
          <div className='error-state'>
            {error}
            <button onClick={fetchChatRooms} className='retry-button'>
              다시 시도
            </button>
          </div>
        ) : chatRooms.length === 0 ? (
          <div className='empty-state'>아직 채팅방이 없습니다.</div>
        ) : (
          <ChatRoomList rooms={chatRooms} onSelectRoom={onSelectChatRoom} />
        )}
      </div>
    </div>
  );
};

/* 📌 PropTypes 설정 */
ChatModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired, // 모달 표시 여부
  onSelectChatRoom: PropTypes.func.isRequired, // 채팅방 선택 시 호출할 함수
  onClose: PropTypes.func.isRequired, // 모달 닫기 함수
};

export default ChatModal;
