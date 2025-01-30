// src/services/chatRoomsWebSocket.js
class ChatRoomsWebSocketService {
  constructor(onUpdateCallback) {
    this.ws = null;
    this.onUpdateCallback = onUpdateCallback;
  }

  connect() {
    this.ws = new WebSocket('ws://localhost:8080/ws/chatRooms');

    this.ws.onopen = () => {
      console.log('ChatRooms WebSocket Connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const updatedRooms = JSON.parse(event.data);
        this.onUpdateCallback(updatedRooms);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('ChatRooms WebSocket Error:', error);
    };

    this.ws.onclose = () => {
      console.log('ChatRooms WebSocket Disconnected');
      // 연결이 끊어졌을 때 재연결 시도
      setTimeout(() => {
        this.connect();
      }, 3000);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default ChatRoomsWebSocketService;
