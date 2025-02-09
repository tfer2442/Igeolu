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
    if (this.isConnected && this.stompClient?.connected) {
      console.log('이미 연결된 상태입니다.');
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        // 기존 연결이 있다면 정리
        if (this.stompClient) {
          this.stompClient.deactivate();
          this.stompClient = null;
        }

        // 연결 시도 전 상태 초기화
        this.isConnected = false;

        this.stompClient = new Client({
          webSocketFactory: () => new WebSocket(this.SOCKET_URL),
          reconnectDelay: 3000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          debug: function(str) {
            console.log('STOMP: ' + str);
          },
          onConnect: () => {
            console.log('WebSocket 연결 성공');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            resolve();
          },
          onStompError: (frame) => {
            console.error('STOMP 에러:', frame);
            this.isConnected = false;
            reject(new Error('STOMP connection failed'));
          },
          onWebSocketClose: () => {
            console.log('WebSocket 연결 종료 - 재연결 시도');
            this.isConnected = false;
          },
          onWebSocketError: (event) => {
            console.error('WebSocket 에러:', event);
            this.isConnected = false;
            reject(new Error('WebSocket connection failed'));
          }
        });

        // 활성화 전에 상태 체크
        if (!this.stompClient) {
          throw new Error('STOMP client initialization failed');
        }

        this.stompClient.activate();
      } catch (error) {
        this.isConnected = false;
        console.error('WebSocket 연결 중 에러:', error);
        reject(error);
      }
    });
  }

  disconnect() {
    console.log('WebSocket 연결 해제 시도');
    if (this.stompClient) {
      try {
        if (this.stompClient.connected) {
          this.stompClient.deactivate();
        }
      } catch (error) {
        console.error('연결 해제 중 에러:', error);
      } finally {
        this.isConnected = false;
        this.stompClient = null;
      }
    }
  }

  // 하위 클래스에서 구현
  subscribe() {
    throw new Error('subscribe method must be implemented');
  }
}

export default BaseWebSocket;