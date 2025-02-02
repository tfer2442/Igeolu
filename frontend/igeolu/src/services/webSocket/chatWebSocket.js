// services/websocket/chatWebSocket.js
import BaseWebSocket from '../../services/webSocket/baseWebSocket';

class ChatWebSocket extends BaseWebSocket {
  constructor(roomId, onMessageReceived) {
    super();
    this.roomId = roomId;
    this.onMessageReceived = onMessageReceived;
  }

  subscribe() {
    if (!this.stompClient || !this.isConnected) return;

    this.stompClient.subscribe(
      `/sub/chatroom/${this.roomId}`,
      (message) => {
        try {
          const newMessage = JSON.parse(message.body);
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
      this.stompClient.send('/pub/message', {}, JSON.stringify(messageData));
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }
}

export default ChatWebSocket;