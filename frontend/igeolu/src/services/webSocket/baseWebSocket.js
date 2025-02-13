// services/websocket/baseWebSocket.js
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
        // 기존 연결이 있다면 정리
        if (this.stompClient) {
          console.log('기존 연결 정리 중...');
          this.stompClient.deactivate();
          this.stompClient = null;
        }

        // 토큰 가져오기
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoiUk9MRV9SRUFMVE9SIiwiaWF0IjoxNzM4OTAzMDEzLCJleHAiOjE3NDAxMTI2MTN9.s6tgPhKV61WYbIbjPHPg6crY0gFvc0T-RhQJ-bGVGWg';
        console.log('연결 설정 시작:', {
          url: this.SOCKET_URL,
          hasToken: !!token
        });

        this.stompClient = new Client({
          webSocketFactory: () => {
            console.log('WebSocket 팩토리 호출됨');
            const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoiUk9MRV9SRUFMVE9SIiwiaWF0IjoxNzM4OTAzMDEzLCJleHAiOjE3NDAxMTI2MTN9.s6tgPhKV61WYbIbjPHPg6crY0gFvc0T-RhQJ-bGVGWg'; // 토큰값
            const wsUrl = `${this.SOCKET_URL}?token=${token}`;
            console.log('연결 시도 URL:', wsUrl);
            const ws = new WebSocket(wsUrl);  // URL에 토큰을 포함
            return ws;
          },
          // connectHeaders: {
          //   Authorization: `Bearer ${token}`
          // },
          reconnectDelay: 5000,
          heartbeatIncoming: 30000,
          heartbeatOutgoing: 30000,
          debug: function(str) {
            console.log('STOMP 디버그:', str);
          },
          onConnect: () => {
            console.log('STOMP 연결 성공', {
              stompConnected: this.stompClient.connected,
              headers: this.stompClient.connectHeaders
            });
            this.isConnected = true;
            resolve();
          },
          onStompError: (frame) => {
            console.error('STOMP 에러 발생:', {
              frame,
              headers: frame.headers,
              body: frame.body,
              command: frame.command
            });
            this.isConnected = false;
            reject(new Error('STOMP connection failed'));
          },
          onWebSocketError: (event) => {
            console.error('WebSocket 에러 세부 정보:', {
              event,
              type: event.type,
              message: event.message,
              filename: event.filename,
              lineno: event.lineno
            });
          },
          onWebSocketClose: (event) => {
            console.log('WebSocket 연결 종료 세부 정보:', {
              event,
              code: event.code,
              reason: event.reason,
              wasClean: event.wasClean
            });
            this.isConnected = false;
          }
        });

        console.log('STOMP 클라이언트 설정 완료, 활성화 시도...');
        this.stompClient.activate();
      } catch (error) {
        this.isConnected = false;
        console.error('WebSocket 연결 중 예외 발생:', {
          error,
          message: error.message,
          stack: error.stack,
          name: error.name
        });
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
        console.error('연결 해제 중 에러:', {
          error,
          message: error.message,
          stack: error.stack
        });
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