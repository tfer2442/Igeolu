// pages/Mobile/MobileChatRoom.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatRoom from '../../components/common/Chat/ChatRoom/ChatRoom';
import chatApi from '../../services/chatApi';
import { USER } from '../../utils/constants';
import { mockChatRooms } from '../../mocks/chatData';
import './MobileChatRoom.css';

const MobileChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        // mock 데이터에서 해당 roomId의 방 정보 찾기
        const foundRoom = mockChatRooms.find(room => room.roomId === Number(roomId));
        
        if (!foundRoom) {
          throw new Error('채팅방을 찾을 수 없습니다.');
        }

        setRoom(foundRoom);
        await chatApi.markMessagesAsRead(roomId, USER.CURRENT_USER_ID);
      } catch (error) {
        setError('채팅방 정보를 불러오는데 실패했습니다.');
        console.error('채팅방 정보 조회 실패:', error);
      }
    };

    fetchRoomData();
  }, [roomId]);

  const handleBack = () => {
    navigate('/m/chat');
  };

  if (!room) return null;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="mobile-chat-room">
      <ChatRoom room={room} onBack={handleBack} isMobile={true} />
    </div>
  );
};

export default MobileChatRoom;