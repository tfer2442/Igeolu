package com.ssafy.igeolu.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.ssafy.igeolu.global.websocket.CustomHandshakeHandler;
import com.ssafy.igeolu.global.websocket.JwtHandshakeInterceptor;
import com.ssafy.igeolu.oauth.util.JWTUtil;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
	private final JWTUtil jwtUtil;
	private final TaskScheduler taskScheduler;

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {

		// stomp 접속 주소 url = ws://localhost:8080/api/chats/ws, 프로토콜이 http가 아니다!
		registry.addEndpoint("/api/chats/ws") // 연결될 엔드포인트
			// JWT 인증을 위한 handshake interceptor 추가
			.addInterceptors(new JwtHandshakeInterceptor(jwtUtil))
			// 사용자 Principal을 설정하기 위한 custom handshake handler 사용
			.setHandshakeHandler(new CustomHandshakeHandler())
			.setAllowedOrigins("https://i12d205.p.ssafy.io", "http://localhost:3000");
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		// 메시지를 구독(수신)하는 요청 엔드포인트
		// /api/sub 로 시작하는 stomp 메세지는 브로커로 라우팅함
		registry.enableSimpleBroker("/api/sub", "/api/sub-user")
			.setHeartbeatValue(new long[] {10000, 10000}) // 10초 간격
			.setTaskScheduler(taskScheduler);
		// 첫 번째 값: 서버가 클라이언트로 heartbeat를 보내는 간격
		// 두 번째 값: 클라이언트가 서버로 heartbeat를 보내는 간격

		// 메시지를 발행(송신)하는 엔드포인트
		// /api/pub 으로 시작하는 stomp 메세지의 경로는 @controller @MessageMaping 메서드로 라우팅
		registry.setApplicationDestinationPrefixes("/api/pub");

		// 사용자 전용 메시지 전송을 위한 접두사 설정 (예: convertAndSendToUser() 사용 시)
		registry.setUserDestinationPrefix("/api/sub-user");
	}
}