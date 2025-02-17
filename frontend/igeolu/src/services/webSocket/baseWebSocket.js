import { Client } from '@stomp/stompjs';

class BaseWebSocket {
  constructor() {
    this.stompClient = null;
    this.isConnected = false;
    this.SOCKET_URL = 'wss://i12d205.p.ssafy.io/api/chats/ws';
    this.reconnectDelay = 3000;
  }

  async connect() {
    console.log('WebSocket 연결 시도 시작...', {
      currentStatus: {
        isConnected: this.isConnected,
        hasStompClient: !!this.stompClient,
        stompConnected: this.stompClient?.connected
      }
    });

    if (this.isConnected && this.stompClient?.connected) {
      console.log('이미 연결된 상태입니다.');
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        if (this.stompClient) {
          console.log('기존 연결 정리 중...');
          this.stompClient.deactivate();
          this.stompClient = null;
        }

        // const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoiUk9MRV9SRUFMVE9SIiwiaWF0IjoxNzM4OTAzMDEzLCJleHAiOjE3NDAxMTI2MTN9.s6tgPhKV61WYbIbjPHPg6crY0gFvc0T-RhQJ-bGVGWg';
        
        this.stompClient = new Client({
          webSocketFactory: () => {
            const wsUrl = `${this.SOCKET_URL}`;
            // const wsUrl = `${this.SOCKET_URL}?token=${token}`;
            console.log('연결 시도 URL:', wsUrl);
            return new WebSocket(wsUrl);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 10000,
          heartbeatOutgoing: 10000,
          debug: function(str) {
            console.log('STOMP 디버그:', str); // websocket ping-pong 확인용
          },
          onConnect: () => {
            console.log('STOMP 연결 성공');
            this.isConnected = true;
            resolve();
          },
          onStompError: (frame) => {
            console.error('STOMP 에러 발생:', frame);
            this.isConnected = false;
            reject(new Error('STOMP connection failed'));
          },
          onWebSocketError: (event) => {
            console.error('WebSocket 에러:', event);
          },
          onWebSocketClose: (event) => {
            console.log('WebSocket 연결 종료:', event);
            this.isConnected = false;
          }
        });

        console.log('STOMP 클라이언트 설정 완료, 활성화 시도...');
        this.stompClient.activate();
      } catch (error) {
        this.isConnected = false;
        console.error('WebSocket 연결 중 예외 발생:', error);
        reject(error);
      }
    });
  }

  disconnect() {
    console.log('WebSocket 연결 해제 시도:', {
      hasStompClient: !!this.stompClient,
      isConnected: this.isConnected,
      stompConnected: this.stompClient?.connected
    });

    if (this.stompClient) {
      try {
        if (this.stompClient.connected) {
          this.stompClient.deactivate();
          console.log('STOMP 클라이언트 비활성화 완료');
        }
      } catch (error) {
        console.error('연결 해제 중 에러:', error);
      } finally {
        this.isConnected = false;
        this.stompClient = null;
        console.log('연결 상태 초기화 완료');
      }
    }
  }

  // 하위 클래스에서 구현
  subscribe() {
    throw new Error('subscribe method must be implemented');
  }
}

export default BaseWebSocket;