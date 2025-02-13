package com.ssafy.igeolu.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		// stomp 접속 주소 url = ws://localhost:8080/api/chats/ws, 프로토콜이 http가 아니다!
		registry.addEndpoint("/api/chats/ws") // 연결될 엔드포인트
			.setAllowedOrigins("https://i12d205.p.ssafy.io", "http://localhost:3000");
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		// 메시지를 구독(수신)하는 요청 엔드포인트
		// /api/sub 로 시작하는 stomp 메세지는 브로커로 라우팅함
		registry.enableSimpleBroker("/api/sub", "/api/sub-user");

		// 메시지를 발행(송신)하는 엔드포인트
		// /api/pub 으로 시작하는 stomp 메세지의 경로는 @controller @MessageMaping 메서드로 라우팅
		registry.setApplicationDestinationPrefixes("/api/pub");

		// 사용자 전용 메시지 전송을 위한 접두사 설정 (예: convertAndSendToUser() 사용 시)
		registry.setUserDestinationPrefix("/api/sub-user");
	}
}