// services/websocket/chatWebSocket.js
import BaseWebSocket from '../../services/webSocket/baseWebSocket';

class ChatWebSocket extends BaseWebSocket {
  constructor(roomId, onMessageReceived) {
    super();
    this.roomId = roomId;
    this.onMessageReceived = onMessageReceived;
  }

  checkConnection() {
    if (!this.stompClient || !this.isConnected) {
      console.log('WebSocket is not connected. Trying to reconnect...');
      this.connect().then(() => {
        console.log('Reconnected successfully.');
        this.subscribeToMessages();
      }).catch((error) => {
        console.error('Reconnection failed:', error);
      });
    }
  }

  subscribeToMessages() {
    if (!this.stompClient || !this.isConnected) {
      console.error('Cannot subscribe, WebSocket is not connected.');
      return;
    }

    // 모든 메시지를 하나의 엔드포인트에서 처리
    this.stompClient.subscribe(
      `/api/sub/chats/${this.roomId}`,
      (message) => {
        try {
          const newMessage = JSON.parse(message.body);
          console.log('Received message:', newMessage);
          this.onMessageReceived(newMessage);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      }
    );
  }

  subscribe() {
    if (!this.stompClient || !this.isConnected) return;
  
    this.stompClient.subscribe(
      `/api/sub/chats/${this.roomId}`,
      (message) => {
        try {
          console.log('WebSocket 메시지 수신:', message);
          const newMessage = JSON.parse(message.body);
          console.log('파싱된 메시지:', newMessage);
          this.onMessageReceived(newMessage);
        } catch (error) {
          console.error('Failed to parse chat message:', error);
        }
      }
    );
  }

  sendMessage(messageData) {
    if (!this.stompClient || !this.isConnected) {
      console.warn('WebSocket is not connected. Message not sent.');
      return false;
    }
  
    try {
      this.stompClient.send(
        '/api/pub/chats/messages',
        {},
        JSON.stringify({
          roomId: this.roomId,
          userId: messageData.userId,
          content: messageData.content
        })
      );
      console.log('Message sent via WebSocket:', messageData);
      return true;
    } catch (error) {
      console.error('Failed to send message via WebSocket:', error);
      return false;
    }
  }
}

export default ChatWebSocket;