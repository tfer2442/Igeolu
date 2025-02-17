// src/hooks/useChatRooms.js
import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import ChatApi from '../services/ChatApi';

export function useChatRooms() {
  const { user, isLoading: isUserLoading } = useUser();
  const [chatRooms, setChatRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // user 정보가 로드되기 전이면 리턴
    if (isUserLoading) {
      return;
    }

    // user가 null이면 채팅방 비우기
    if (!user) {
      setChatRooms([]);
      setIsLoading(false);
      return;
    }

    const fetchAndFilterChatRooms = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await ChatApi.getChatRooms(user.userId);
        
        // 응답이 배열이 아닌 경우 처리
        if (!Array.isArray(response)) {
          console.warn('Received non-array response:', response);
          setChatRooms([]);
          return;
        }

        // role에 따라 채팅방 필터링
        const filteredRooms = response.filter(room => {
          if (!room || !room.roomStatus) return false;
          
          const userRole = user.role.toLowerCase();
          if (userRole === 'member') {
            return ['BOTH', 'MEMBER'].includes(room.roomStatus);
          } else if (userRole === 'realtor') {
            return ['BOTH', 'REALTOR'].includes(room.roomStatus);
          }
          
          return false;
        });

        setChatRooms(filteredRooms);
      } catch (err) {
        console.error('Failed to fetch chat rooms:', err);
        setError('채팅방 목록을 불러오는데 실패했습니다.');
        setChatRooms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndFilterChatRooms();
  }, [user, isUserLoading]); // user나 isUserLoading이 변경될 때마다 실행

  return {
    chatRooms,
    isLoading: isUserLoading || isLoading, // 사용자 정보 로딩중이거나 채팅방 로딩중일 때
    error
  };
}