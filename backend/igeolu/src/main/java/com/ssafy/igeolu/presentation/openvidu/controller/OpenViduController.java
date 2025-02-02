package com.ssafy.igeolu.presentation.openvidu.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.igeolu.facade.live.dto.request.JoinLivePostRequestDto;
import com.ssafy.igeolu.facade.live.dto.request.StartLivePostRequestDto;
import com.ssafy.igeolu.facade.live.dto.response.JoinLivePostResponseDto;
import com.ssafy.igeolu.facade.live.dto.response.StartLivePostResponseDto;

import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.ConnectionType;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduRole;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class OpenViduController {
	private final OpenVidu openVidu;

	@PostMapping("/api/lives")
	public ResponseEntity<StartLivePostResponseDto> startLive(@RequestBody @Valid StartLivePostRequestDto request) {
		try {
			// 1. 고유한 세션 ID 생성
			String sessionId = "session-" + request.getRealtorId() + "-" + System.currentTimeMillis();

			// 2. 세션 속성 설정 (커스텀 세션 ID 사용)
			SessionProperties properties = new SessionProperties.Builder()
				.customSessionId(sessionId)
				.build();

			// 3. OpenVidu 서버에 새로운 세션 생성
			Session session = openVidu.createSession(properties);

			// 4. 연결 속성 설정 (퍼블리셔 역할로 설정, 데이터는 리얼터 ID를 String으로 변환)
			ConnectionProperties connectionProps = new ConnectionProperties.Builder()
				.type(ConnectionType.WEBRTC)
				.role(OpenViduRole.PUBLISHER)
				.data(String.valueOf(request.getRealtorId())) // Integer를 String으로 변환
				.build();

			// 5. 세션에 연결 생성 후 토큰 발급
			Connection connection = session.createConnection(connectionProps);
			String token = connection.getToken();

			// 6. 라이브 URL 생성 (프론트엔드 URL에 세션 ID 포함)
			String liveUrl = "https://i12d205.p.ssafy.io/lives?sessionId=" + session.getSessionId();

			StartLivePostResponseDto startLivePostResponseDto = StartLivePostResponseDto.builder()
				.liveUrl(liveUrl)
				.sessionId(sessionId)
				.token(token)
				.build();

			return ResponseEntity.ok(startLivePostResponseDto);
		} catch (Exception e) {
			throw new RuntimeException("Error starting live session", e);
		}
	}

	@PostMapping("/api/lives/join")
	public ResponseEntity<JoinLivePostResponseDto> joinLive(@RequestBody @Valid JoinLivePostRequestDto request) {
		try {
			Session session = openVidu.getActiveSession(request.getSessionId());

			if (session == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(null);
			}

			ConnectionProperties connectionProps = new ConnectionProperties.Builder()
				.type(ConnectionType.WEBRTC)
				.role(OpenViduRole.SUBSCRIBER)
				.data("Customer")
				.build();

			Connection connection = session.createConnection(connectionProps);
			String token = connection.getToken();
			JoinLivePostResponseDto responseDto = JoinLivePostResponseDto.builder()
				.token(token)
				.build();
			return ResponseEntity.ok(responseDto);
		} catch (Exception e) {
			throw new RuntimeException("Error joining live session", e);
		}
	}
}
