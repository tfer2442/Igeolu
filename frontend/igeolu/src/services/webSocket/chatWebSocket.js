// services/websocket/chatWebSocket.js
import BaseWebSocket from './baseWebSocket';

class ChatWebSocket extends BaseWebSocket {
  constructor(roomId, onMessageReceived) {
    super();
    this.roomId = roomId;
    this.onMessageReceived = onMessageReceived;
    this.subscription = null;
  }

  // chatWebSocket.js
async connect() {

  let retryCount = 0;
  const maxRetries = 3;


  while (retryCount < maxRetries) {
    try {
      await super.connect();
      
      // 연결 상태 더블 체크
      if (!this.stompClient?.connected) {
        throw new Error('STOMP connection check failed');
      }

      console.log('채팅 WebSocket 연결 성공:', {
        isConnected: this.isConnected,
        stompConnected: this.stompClient?.connected,
        roomId: this.roomId
      });

      // 구독 시도
      await this.subscribeToMessages();
      return;
      
    } catch (error) {
      retryCount++;
      console.error(`WebSocket 연결 실패 (시도 ${retryCount}/${maxRetries}):`, error);
      
      if (retryCount === maxRetries) {
        throw new Error(`WebSocket connection failed after ${maxRetries} attempts`);
      }
      
      // 재시도 전 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

  // ChatWebSocket.js에 로그 추가
  subscribeToMessages() {
    if (!this.stompClient || !this.isConnected) {
      console.error('구독 실패: WebSocket 연결되지 않음');
      return;
    }
  
    try {
      const subscriptionPath = `/api/sub/chats/${this.roomId}`;
      console.log('메시지 구독 시도:', {
        path: subscriptionPath,
        roomId: this.roomId
      });
  
      // 구독 설정
      this.subscription = this.stompClient.subscribe(
        subscriptionPath,
        (message) => {
          console.log('구독으로 메시지 수신:', {
            messageData: message,
            subscription: this.subscription,
            isConnected: this.stompClient.connected
          });
  
          try {
            const parsedMessage = JSON.parse(message.body);
            console.log('파싱된 메시지:', parsedMessage);
            this.onMessageReceived(parsedMessage);
          } catch (error) {
            console.error('메시지 파싱 실패:', error);
          }
        },
        {
          id: `chat-${this.roomId}`,
          roomId: this.roomId
        }
      );
  
      console.log('구독 설정 완료:', {
        subscriptionId: this.subscription.id,
        active: this.subscription.active,
        path: subscriptionPath
      });
  
    } catch (error) {
      console.error('구독 설정 중 오류:', error);
      throw error;
    }
  }

  sendMessage(messageData) {
    if (!this.stompClient || !this.isConnected) {
      console.warn('메시지 전송 실패: WebSocket 연결되지 않음');
      return false;
    }
  
    try {
      this.stompClient.publish({
        destination: '/api/pub/chats/messages',
        body: JSON.stringify({
          roomId: this.roomId,
          writerId: messageData.userId,
          content: messageData.content
        })
      });
      return true;
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      return false;
    }
  }

  disconnect() {
    if (this.subscription) {
      try {
        this.subscription.unsubscribe();
        this.subscription.active = false;  // active 상태 업데이트
      } catch (error) {
        console.error('구독 해제 중 오류:', error);
      } finally {
        this.subscription = null;
      }
    }
    super.disconnect();
  }

  subscribe() {
    if (this.subscription) {
      console.log('이미 구독 중입니다.');
      return;
    }
    this.subscribeToMessages();
  }
}

export default ChatWebSocket;
