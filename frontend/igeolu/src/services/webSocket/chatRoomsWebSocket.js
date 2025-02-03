// services/websocket/chatRoomsWebSocket.js
import BaseWebSocket from '../../services/webSocket/baseWebSocket';

class ChatRoomsWebSocket extends BaseWebSocket {
  constructor(userId, onUpdateCallback) {  // userId 매개변수 추가
    super();
    this.userId = userId;  // userId 저장
    this.onUpdateCallback = onUpdateCallback;
  }

  subscribe() {
    if (!this.stompClient || !this.isConnected) return;

    // userId를 포함한 topic으로 구독
    this.stompClient.subscribe(`/sub/chats/${this.userId}`, (message) => {
      try {
        const updatedRooms = JSON.parse(message.body);
        this.onUpdateCallback(updatedRooms);
      } catch (error) {
        console.error('Failed to parse chat rooms update:', error);
      }
    });
  }
}

export default ChatRoomsWebSocket;
