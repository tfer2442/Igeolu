// services/websocket/chatWebSocket.js
import BaseWebSocket from './baseWebSocket';

class ChatWebSocket extends BaseWebSocket {
  constructor(roomId, onMessageReceived) {
    super();
    this.roomId = roomId;
    this.onMessageReceived = onMessageReceived;
    this.subscription = null;
  }

  async connect() {
    try {
      console.log('연결 시도 시작');
      await super.connect();
      console.log('super.connect 완료', this.stompClient, this.isConnected);
      await this.subscribeToMessages();
      console.log('구독 완료');
    } catch (error) {
      console.error('상세 연결 에러:', error);
      throw error;
    }
  }

  subscribeToMessages() {
    if (!this.stompClient || !this.isConnected) {
      console.error('Cannot subscribe: WebSocket not connected');
      return;
    }

    this.subscription = this.stompClient.subscribe(
      `/api/sub/chats/${this.roomId}`,
      (message) => {
        try {
          const parsedMessage = JSON.parse(message.body);
          console.log('Received message:', parsedMessage);
          this.onMessageReceived(parsedMessage);
        } catch (error) {
          console.error('Message parsing failed:', error);
        }
      }
    );
  }

  sendMessage(messageData) {
    if (!this.stompClient || !this.isConnected) {
      console.warn('Cannot send: WebSocket not connected');
      return false;
    }
  
    try {
      const messageBody = {
        roomId: this.roomId,
        writerId: messageData.userId,
        content: messageData.content
      };
      
      console.log('Sending message:', messageBody); // 메시지 전송 정보 출력
      
      this.stompClient.publish({
        destination: '/api/pub/chats/messages',
        body: JSON.stringify(messageBody)
      });
      return true;
    } catch (error) {
      console.error('Message sending failed:', error);
      return false;
    }
}

  disconnect() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    super.disconnect();
  }

  subscribe() {
    // BaseWebSocket의 subscribe()를 오버라이드하여 중복 구독 방지
    if (this.subscription) return;
    this.subscribeToMessages();
  }
}



export default ChatWebSocket;