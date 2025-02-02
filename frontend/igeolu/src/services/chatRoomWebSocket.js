import { Stomp } from '@stomp/stompjs';

class ChatRoomsWebSocketService {
  constructor(onUpdateCallback) {
    this.stompClient = null;
    this.onUpdateCallback = onUpdateCallback;
  }

  connect() {
    const socket = new WebSocket('ws://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);
    
    return new Promise((resolve, reject) => {
      this.stompClient.connect({}, () => {
        console.log('ChatRooms WebSocket Connected');
        
        // 채팅방 목록 업데이트를 구독
        this.stompClient.subscribe('/sub/chatRooms', (message) => {
          try {
            const updatedRooms = JSON.parse(message.body);
            this.onUpdateCallback(updatedRooms);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        });

        resolve();
      }, (error) => {
        console.error('ChatRooms WebSocket Error:', error);
        // 연결 실패시 재시도
        setTimeout(() => {
          this.connect();
        }, 3000);
        reject(error);
      });

      // 연결이 끊어졌을 때 재연결 시도
      this.stompClient.onDisconnect = () => {
        console.log('ChatRooms WebSocket Disconnected');
        setTimeout(() => {
          this.connect();
        }, 3000);
      };
    });
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect();
      this.stompClient = null;
    }
  }
}

export default ChatRoomsWebSocketService;