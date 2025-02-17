// src/pages/MobileChatRoomPage/MobileChatRoomPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import ChatRoom from '../../components/common/Chat/ChatRoom/ChatRoom';
import LoadingSpinner from '../../components/LoadingSpinner/MobileLoadingSpinner';
import chatApi from '../../services/ChatApi';
import './MobileChatRoomPage.css';

const MobileChatRoom = ({ currentUserId: propCurrentUserId }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatRoomOpen, setIsChatRoomOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(propCurrentUserId);

  // 사용자 인증 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // localStorage에서 사용자 정보 확인
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const { userId } = JSON.parse(savedUser);
          setCurrentUserId(userId);
          return;
        }

        // localStorage에 없다면 API 호출
        const response = await fetch('https://i12d205.p.ssafy.io/api/users/me', {
          method: 'GET',
          credentials: 'include',
          withCredentials: true,
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        const data = await response.json();
        if (data.userId) {
          setCurrentUserId(data.userId);
          localStorage.setItem('user', JSON.stringify({
            userId: data.userId,
            role: data.role,
          }));
        } else {
          throw new Error('User not found');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        navigate('/mobile-login');
      }
    };

    if (!currentUserId) {
      checkAuthStatus();
    }
  }, [currentUserId, navigate]);

  useEffect(() => {
    setIsChatRoomOpen(true);
    return () => setIsChatRoomOpen(false);
  }, []);

  const handleRoomUpdate = async (roomId) => {
    if (!currentUserId) {
      console.error('User ID not available');
      return;
    }

    try {
      await chatApi.markMessagesAsRead(roomId, currentUserId);
    } catch (error) {
      console.error('메시지 읽음 처리 실패:', error);
    }
  };

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!currentUserId) {
        return;
      }
  
      try {
        // localStorage에서 role 가져오기
        const savedUser = localStorage.getItem('user');
        const userRole = savedUser ? JSON.parse(savedUser).role : null;
  
        if (!userRole) {
          throw new Error('사용자 권한을 찾을 수 없습니다.');
        }
  
        // role 함께 전달
        const rooms = await chatApi.getChatRooms(currentUserId, userRole);
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
  
    if (currentUserId) {
      fetchRoomData();
    }
  }, [roomId, currentUserId]);

  const handleBack = () => {
    navigate('/mobile-chat');
  };

  // 사용자 인증 확인 중에는 로딩 표시
  if (!currentUserId || isLoading) return <LoadingSpinner />;
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
          activeRoomId={Number(roomId)}
          onRoomUpdate={handleRoomUpdate}
          isChatRoomOpen={isChatRoomOpen}
        />
      </div>
    </div>
  );
};

MobileChatRoom.propTypes = {
  currentUserId: PropTypes.number,
};

export default MobileChatRoom;