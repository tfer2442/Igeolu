// services/webSocket/notificationWebSocket.js
import BaseWebSocket from './baseWebSocket';

class NotificationWebSocket extends BaseWebSocket {
  constructor(userId, onNotificationReceived) {
    super();
    this.userId = userId;
    this.onNotificationReceived = onNotificationReceived;
    this.subscription = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 5000; // 5초
  }

  async reconnect() {
    // console.log('🔄 재연결 프로세스 시작', {
    //   시도횟수: this.reconnectAttempts + 1,
    //   최대시도횟수: this.maxReconnectAttempts,
    // });

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ 최대 재연결 시도 횟수 초과');
      return;
    }

    try {
      this.reconnectAttempts++;

      // 이전 연결 정리
      if (this.stompClient) {
        // console.log('🧹 이전 연결 정리 중...');
        this.disconnect();
      }

      // 새로운 연결 시도
      // console.log(`🔄 ${this.reconnectAttempts}번째 재연결 시도...`);
      await this.connect();

      // 재구독
      if (this.isConnected) {
        // console.log('✅ 재연결 성공, 재구독 시도...');
        this.subscribe();
        this.reconnectAttempts = 0; // 성공 시 카운터 리셋
        // console.log('✅ 재구독 완료');
      }
    } catch (error) {
      console.error('❌ 재연결 실패:', error);

      // 일정 시간 후 다시 시도
      setTimeout(() => {
        this.reconnect();
      }, this.reconnectInterval);
    }
  }

  subscribe() {
    if (!this.stompClient || !this.isConnected) {
      console.error('❌ 구독 실패: WebSocket 연결되지 않음');
      return;
    }

    try {
      const subscriptionPath = `/api/sub-user/${this.userId}/notifications`;
      // console.log('📌 알림 구독 시도:', {
      //   path: subscriptionPath,
      //   userId: this.userId,
      // });

      this.subscription = this.stompClient.subscribe(
        subscriptionPath,
        (message) => {
          // console.log('📨 웹소켓으로 새로운 알림 수신:', {
          //   원본메시지: message,
          //   바디: message.body,
          //   헤더: message.headers,
          //   구독ID: this.subscription?.id,
          // });

          try {
            const notification = JSON.parse(message.body);
            // console.log('✅ 파싱된 알림 데이터:', {
            //   알림ID: notification.notificationId,
            //   메시지: notification.message,
            //   생성시간: notification.createdAt,
            //   읽음여부: notification.isRead,
            // });
            this.onNotificationReceived(notification);
          } catch (error) {
            console.error('❌ 알림 파싱 실패:', error);
          }
        },
        {
          id: `notification-${this.userId}`,
        }
      );

      // console.log('✅ 알림 구독 완료');
    } catch (error) {
      console.error('❌ 알림 구독 중 오류:', error);
      throw error;
    }
  }

  // BaseWebSocket의 connect 메서드를 override하여 onWebSocketClose 핸들러 추가
  async connect() {
    try {
      await super.connect();

      // WebSocket 종료 이벤트 핸들러 추가
      if (this.stompClient) {
        const originalOnWebSocketClose = this.stompClient.onWebSocketClose;
        this.stompClient.onWebSocketClose = (event) => {
          console.log('⚠️ WebSocket 연결 종료:', {
            code: event.code,
            reason: event.reason || '이유 없음',
            wasClean: event.wasClean,
            timestamp: new Date().toISOString(),
          });

          // code 1006으로 연결이 종료된 경우 재연결 시도
          if (event.code === 1006) {
            console.log('🔄 Code 1006으로 인한 연결 종료, 재연결 시도...');
            this.reconnect();
          }

          // 기존 핸들러도 호출
          if (originalOnWebSocketClose) {
            originalOnWebSocketClose(event);
          }
        };
      }
    } catch (error) {
      console.error('❌ 연결 실패:', error);
      throw error;
    }
  }

  disconnect() {
    if (this.subscription) {
      try {
        console.log('🔄 알림 구독 해제');
        this.subscription.unsubscribe();
      } catch (error) {
        console.error('❌ 구독 해제 중 오류:', error);
      } finally {
        this.subscription = null;
      }
    }
    super.disconnect();
  }
}

export default NotificationWebSocket;
