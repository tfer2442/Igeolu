// services/websocket/baseWebSocket.js
import { Stomp } from '@stomp/stompjs';

class BaseWebSocket {
  constructor() {
    this.stompClient = null;
    this.isConnected = false;
    this.SOCKET_URL = 'ws://localhost:8080/ws';
    this.reconnectDelay = 3000;
  }

  async connect() {
    if (this.isConnected) return;

    return new Promise((resolve, reject) => {
      try {
        const socket = new WebSocket(this.SOCKET_URL);
        this.stompClient = Stomp.over(socket);

        this.stompClient.connect(
          {},
          () => {
            console.log('WebSocket Connected');
            this.isConnected = true;
            this.subscribe();
            resolve();
          },
          (error) => {
            console.error('WebSocket Connection Error:', error);
            this.isConnected = false;
            this.handleReconnect();
            reject(error);
          }
        );

        this.setupDisconnectHandler();
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
    setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.connect();
    }, this.reconnectDelay);
  }

  disconnect() {
    if (this.stompClient && this.isConnected) {
      this.stompClient.disconnect();
      this.isConnected = false;
    }
  }

  // 하위 클래스에서 구현할 메서드
  subscribe() {
    throw new Error('subscribe method must be implemented');
  }
}

export default BaseWebSocket;