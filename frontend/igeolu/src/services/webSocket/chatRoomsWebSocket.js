// services/websocket/chatRoomsWebSocket.js
import BaseWebSocket from '../../services/webSocket/baseWebSocket';

class ChatRoomsWebSocket extends BaseWebSocket {
  constructor(userId, onUpdateCallback) {
    super();
    this.userId = userId;
    this.onUpdateCallback = onUpdateCallback;
    this.subscriptions = new Map(); // 구독 관리용 Map
  }

  // 모든 채팅방 구독
  subscribeToChatRooms(chatRooms) {
    if (!this.stompClient || !this.isConnected) {
      console.log('WebSocket이 연결되지 않았습니다.');
      return;
    }

    // 사용자의 전체 업데이트를 위한 구독
    this.subscribeToUserUpdates();

    // 각 채팅방 구독
    chatRooms.forEach(room => {
      this.subscribeToRoom(room.roomId);
    });
  }

  // 사용자 전체 업데이트 구독
  subscribeToUserUpdates() {
    const userSubscription = this.stompClient.subscribe(
      `/api/sub/chats/${this.userId}`,
      (message) => {
        try {
          // console.log('사용자 업데이트 수신:', message);
          this.onUpdateCallback();
        } catch (error) {
          console.error('메시지 파싱 실패:', error);
        }
      }
    );
    this.subscriptions.set('user', userSubscription);
  }

  // 개별 채팅방 구독
  subscribeToRoom(roomId) {
    if (this.subscriptions.has(`room-${roomId}`)) {
      // console.log(`채팅방 ${roomId}는 이미 구독 중입니다.`);
      return;
    }

    // console.log(`채팅방 ${roomId} 구독 시작`);
    const subscription = this.stompClient.subscribe(
      `/api/sub/chats/${roomId}`,
      (message) => {
        try {
          // console.log(`채팅방 ${roomId} 메시지 수신:`, message);
          this.onUpdateCallback();
        } catch (error) {
          console.error('메시지 파싱 실패:', error);
        }
      }
    );
    this.subscriptions.set(`room-${roomId}`, subscription);
  }

  // 연결 해제 시 모든 구독 정리
  disconnect() {
    console.log('WebSocket 연결 해제 중...');
    this.subscriptions.forEach((subscription, key) => {
      try {
        subscription.unsubscribe();
        console.log(`구독 해제 완료: ${key}`);
      } catch (error) {
        console.error(`구독 해제 실패 (${key}):`, error);
      }
    });
    this.subscriptions.clear();
    super.disconnect();
  }
}

export default ChatRoomsWebSocket;