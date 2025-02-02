// services/websocket/chatRoomsWebSocket.js
import BaseWebSocket from '../../services/webSocket/baseWebSocket';

class ChatRoomsWebSocket extends BaseWebSocket {
  constructor(onUpdateCallback) {
    super();
    this.onUpdateCallback = onUpdateCallback;
  }

  subscribe() {
    if (!this.stompClient || !this.isConnected) return;

    this.stompClient.subscribe('/sub/chatRooms', (message) => {
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
