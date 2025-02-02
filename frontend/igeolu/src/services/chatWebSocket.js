import { Stomp } from '@stomp/stompjs';

class ChatWebSocketService {
  constructor(roomId, onMessageReceived) {
    this.roomId = roomId;
    this.onMessageReceived = onMessageReceived;
    this.stompClient = null;
    this.isConnected = false;
  }

  async connect() {
    const socket = new WebSocket('ws://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);
    
    return new Promise((resolve, reject) => {
      this.stompClient.connect({}, () => {
        this.isConnected = true;
        this.stompClient.subscribe(`/sub/chatroom/${this.roomId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          this.onMessageReceived(newMessage);
        });
        resolve();
      }, (error) => {
        console.error('WebSocket 연결 실패:', error);
        this.isConnected = false;
        reject(error);
      });
    });
  }

  disconnect() {
    if (this.stompClient && this.isConnected) {
      this.stompClient.disconnect();
      this.isConnected = false;
    }
  }

  // WebSocket은 실시간 알림용으로만 사용
  // 실제 메시지는 REST API를 통해 전송
  notifyNewMessage(messageData) {
    if (this.stompClient && this.isConnected) {
      this.stompClient.send('/pub/message', {}, JSON.stringify(messageData));
    }
  }
}

export default ChatWebSocketService;