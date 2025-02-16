// services/websocket/chatWebSocket.js
import BaseWebSocket from './baseWebSocket';

class ChatWebSocket extends BaseWebSocket {
  constructor(roomId, onMessageReceived) {
    super();
    this.roomId = roomId;
    this.onMessageReceived = onMessageReceived;
    this.isActive = false;
  }

  setActive(isActive) {
    // 활성화 상태가 변경될 때마다 로그
    // console.log(`ChatWebSocket: Room ${this.roomId} active state changed to:`, isActive);
    this.isActive = isActive;
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

        // console.log('채팅 WebSocket 연결 성공:', {
        //   isConnected: this.isConnected,
        //   stompConnected: this.stompClient?.connected,
        //   roomId: this.roomId
        // });

        // 구독 시도
        await this.subscribeToMessages();
        return;
      } catch (error) {
        retryCount++;
        console.error(
          `WebSocket 연결 실패 (시도 ${retryCount}/${maxRetries}):`,
          error
        );

        if (retryCount === maxRetries) {
          throw new Error(
            `WebSocket connection failed after ${maxRetries} attempts`
          );
        }

        // 재시도 전 잠시 대기
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  handleMessage(message) {
    // 현재 채팅방의 활성화 상태와 함께 메시지 전달
    // console.log(`ChatWebSocket: Handling message for room ${this.roomId}, isActive:`, this.isActive);
    this.onMessageReceived(message, this.isActive);
  }

  // ChatWebSocket.js에 로그 추가
  subscribeToMessages() {
    if (!this.stompClient || !this.isConnected) {
      console.error('ChatWebSocket: Subscription failed - not connected');
      return;
    }

    try {
      const subscriptionPath = `/api/sub/chats/${this.roomId}`;
      // console.log(`ChatWebSocket: Subscribing to ${subscriptionPath}`);
      
      this.subscription = this.stompClient.subscribe(
        subscriptionPath,
        (message) => {
          try {
            const parsedMessage = JSON.parse(message.body);
            this.handleMessage(parsedMessage);
          } catch (error) {
            console.error('ChatWebSocket: Message parsing failed:', error);
          }
        },
        {
          id: `chat-${this.roomId}`,
          roomId: this.roomId,
        }
      );

      // console.log(`ChatWebSocket: Successfully subscribed to room ${this.roomId}`);
    } catch (error) {
      console.error('ChatWebSocket: Subscription setup failed:', error);
      throw error;
    }
  }


  sendMessage(messageData) {
    if (!this.stompClient || !this.isConnected) {
      console.warn('ChatWebSocket: Message send failed - not connected');
      return false;
    }

    try {
      this.stompClient.publish({
        destination: '/api/pub/chats/messages',
        body: JSON.stringify({
          roomId: this.roomId,
          writerId: messageData.userId,
          content: messageData.content,
          senderType: messageData.senderType,
        }),
      });
      return true;
    } catch (error) {
      console.error('ChatWebSocket: Message send failed:', error);
      return false;
    }
  }


  disconnect() {
    if (this.subscription) {
      try {
        this.subscription.unsubscribe();
        this.subscription.active = false; // active 상태 업데이트
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
      // console.log('이미 구독 중입니다.');
      return;
    }
    this.subscribeToMessages();
  }
}

export default ChatWebSocket;
