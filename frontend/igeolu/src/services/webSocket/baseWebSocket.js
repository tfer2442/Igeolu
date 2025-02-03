// services/websocket/baseWebSocket.js
import { Client } from '@stomp/stompjs';

class BaseWebSocket {
  constructor() {
    this.stompClient = null;
    this.isConnected = false;
    this.SOCKET_URL = 'wss://i12d205.p.ssafy.io/api/chats/ws';
    this.reconnectDelay = 3000;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  async connect() {
    if (this.isConnected) return;

    return new Promise((resolve, reject) => {
      try {
        console.log('Connecting to WebSocket at:', this.SOCKET_URL);
      const socket = new WebSocket(this.SOCKET_URL);
      
      socket.onopen = () => {
        console.log('WebSocket connection opened');
      };

      socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };

      socket.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
      };

        this.stompClient = new Client({
          brokerURL: this.SOCKET_URL,
          reconnectDelay: this.reconnectDelay,
          onConnect: () => {
            console.log('WebSocket Connected Successfully');
            this.isConnected = true;
            this.subscribe();
            resolve();
          },
          onDisconnect: () => {
            console.log('WebSocket Disconnected');
            this.isConnected = false;
            this.handleReconnect();
          },
          onStompError: (error) => {
            console.error('Stomp Error:', error);
            reject(error);
          }
        });

        this.stompClient.activate();
      } catch (error) {
        console.error('WebSocket Setup Error:', error);
        reject(error);
      }
    });
  }

  setupDisconnectHandler() {
    if (this.stompClient) {
      this.stompClient.onDisconnect = () => {
        console.log('WebSocket Disconnected');
        this.isConnected = false;
        this.handleReconnect();
      };
    }
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
        this.reconnectAttempts++;  // 순서 변경: 증가를 먼저
        this.connect().catch(error => {
          console.error('Reconnection failed:', error);
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached. Please refresh the page.');
          }
        });
      }, this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
      // 여기서 사용자에게 알림을 주는 콜백을 호출할 수 있음
    }
  }

  disconnect() {
    if (this.stompClient) {
      try {
        if (this.stompClient.disconnect && typeof this.stompClient.disconnect === 'function') {
          this.stompClient.disconnect();
        } else if (this.stompClient.close && typeof this.stompClient.close === 'function') {
          this.stompClient.close();
        }
        this.isConnected = false;
        console.log('WebSocket 연결 해제 완료');
      } catch (error) {
        console.error('WebSocket 연결 해제 중 에러:', error);
      }
    }
  }

  // 하위 클래스에서 구현할 메서드
  subscribe() {
    throw new Error('subscribe method must be implemented');
  }
}

export default BaseWebSocket;