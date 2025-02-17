// src/services/ChatRoomManager.js
import ChatApi from './ChatApi';

export class ChatRoomManager {
  constructor(userId, userRole) {
    this.userId = userId;
    this.userRole = userRole;
  }

  async getChatRooms() {
    try {
      const rooms = await ChatApi.getChatRooms(this.userId);
      return this.filterRoomsByUserRole(rooms);
    } catch (error) {
      console.error('Failed to fetch chat rooms:', error);
      return [];
    }
  }

  filterRoomsByUserRole(rooms) {
    if (!Array.isArray(rooms)) {
      console.warn('Received non-array rooms data:', rooms);
      return [];
    }

    return rooms.filter(room => {
      if (!room || !room.roomStatus) {
        console.warn('Invalid room data:', room);
        return false;
      }

      if (this.userRole === 'member') {
        return ['BOTH', 'MEMBER'].includes(room.roomStatus);
      } else if (this.userRole === 'realtor') {
        return ['BOTH', 'REALTOR'].includes(room.roomStatus);
      }
      
      return false;
    });
  }

  static updateRoomStatus(room, userRole, isLeaving) {
    if (!room || !room.roomStatus) return room;

    const statusMatrix = {
      BOTH: {
        member: 'REALTOR',
        realtor: 'MEMBER'
      },
      MEMBER: {
        member: 'NONE',
        realtor: 'BOTH'
      },
      REALTOR: {
        member: 'BOTH',
        realtor: 'NONE'
      },
      NONE: {
        member: 'MEMBER',
        realtor: 'REALTOR'
      }
    };

    if (isLeaving) {
      // 채팅방을 나가는 경우
      return {
        ...room,
        roomStatus: statusMatrix[room.roomStatus][userRole] || room.roomStatus
      };
    } else {
      // 채팅방에 들어오는 경우
      const reverseMatrix = {
        NONE: {
          member: 'MEMBER',
          realtor: 'REALTOR'
        },
        MEMBER: {
          realtor: 'BOTH'
        },
        REALTOR: {
          member: 'BOTH'
        }
      };

      const newStatus = reverseMatrix[room.roomStatus]?.[userRole];
      return newStatus ? { ...room, roomStatus: newStatus } : room;
    }
  }
}

// Hook for using ChatRoomManager in components
import { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';

export function useChatRooms() {
  const { user } = useUser();
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.userId || !user?.role) return;

    const fetchRooms = async () => {
      setIsLoading(true);
      try {
        const manager = new ChatRoomManager(user.userId, user.role);
        const filteredRooms = await manager.getChatRooms();
        setRooms(filteredRooms);
        setError(null);
      } catch (err) {
        setError('Failed to fetch chat rooms');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [user?.userId, user?.role]);

  const updateRoomStatus = (roomId, isLeaving = false) => {
    setRooms(prevRooms => {
      return prevRooms.map(room => {
        if (room.roomId === roomId) {
          return ChatRoomManager.updateRoomStatus(room, user.role, isLeaving);
        }
        return room;
      });
    });
  };

  return { rooms, isLoading, error, updateRoomStatus };
}