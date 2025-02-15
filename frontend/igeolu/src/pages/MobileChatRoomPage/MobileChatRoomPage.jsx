// src/pages/MobileChatRoomPage/MobileChatRoomPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import ChatRoom from '../../components/common/Chat/ChatRoom/ChatRoom';
import LoadingSpinner from '../../components/LoadingSpinner/MobileLoadingSpinner';
import chatApi from '../../services/ChatApi';
import './MobileChatRoomPage.css';

const MobileChatRoom = ({ currentUserId }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // roomUpdate 핸들러 추가
  const handleRoomUpdate = async (roomId) => {
    try {
      const rooms = await chatApi.getChatRooms(currentUserId);
      const updatedRoom = rooms.find((r) => r.roomId === Number(roomId));
      if (updatedRoom) {
        setRoom(updatedRoom);
      }
    } catch (error) {
      console.error('방 업데이트 실패:', error);
    }
  };

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const rooms = await chatApi.getChatRooms(currentUserId);
        const foundRoom = rooms.find((r) => r.roomId === Number(roomId));

        if (!foundRoom) {
          throw new Error('채팅방을 찾을 수 없습니다.');
        }

        setRoom(foundRoom);
        await chatApi.markMessagesAsRead(roomId, currentUserId);
      } catch (error) {
        console.error('채팅방 정보 조회 실패:', error);
        setError('채팅방 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomData();
  }, [roomId, currentUserId]);

  const handleBack = () => {
    navigate('/mobile-chat');
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className='error-message'>{error}</div>;
  if (!room) return null;

  return (
    <div className='mobile-chat-room-page-container'>
      <div className='mobile-chat-room'>
        <ChatRoom
          room={room}
          onBack={handleBack}
          isMobile={true}
          currentUserId={currentUserId}
          activeRoomId={Number(roomId)}  // 추가
          onRoomUpdate={handleRoomUpdate}  // 추가
          isChatRoomOpen={true}  // 추가: 모바일에서는 항상 채팅방이 열려있는 상태
        />
      </div>
    </div>
  );
};

MobileChatRoom.propTypes = {
  currentUserId: PropTypes.number.isRequired,
};

export default MobileChatRoom;
