// src/services/chatWebSocket.js
import { Stomp } from '@stomp/stompjs';

class ChatWebSocketService {
  constructor(roomId, onMessageReceived) {
    this.roomId = roomId;
    this.onMessageReceived = onMessageReceived;
    this.stompClient = null;
  }

  // webSocket 연결 설정
  connect() {
    const socket = new WebSocket('ws://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);
    
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe(`/sub/chatroom/${this.roomId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        this.onMessageReceived(newMessage);
      });
    });
  }

  // webSocket 연결 해제
  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect(); 
    }
  }

  sendMessage(message) {
    if (this.stompClient && message) {
      this.stompClient.send('/pub/message', {}, JSON.stringify(message)); // 메시지 전송 API
    }
  }
}

export default ChatWebSocketService;