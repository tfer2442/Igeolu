package com.ssafy.igeolu.presentation.live.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.igeolu.facade.live.dto.request.JoinLivePostRequestDto;
import com.ssafy.igeolu.facade.live.dto.request.StartLivePostRequestDto;
import com.ssafy.igeolu.facade.live.dto.response.JoinLivePostResponseDto;
import com.ssafy.igeolu.facade.live.dto.response.LivePostResponseDto;
import com.ssafy.igeolu.facade.live.service.LiveFacadeService;

import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.ConnectionType;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduRole;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class LiveController {
	privaet final LiveFacadeService liveFacadeService;
	private final OpenVidu openVidu;

	@Operation(summary = "라이브 생성", description = "라이브를 생성합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리")
	})
	@PostMapping("/api/lives")
	public ResponseEntity<LivePostResponseDto> startLive(
		@RequestBody @Valid StartLivePostRequestDto startLivePostRequestDto) {

		return ResponseEntity.ok(liveFacadeService.startLive(startLivePostRequestDto));
	}

	@PostMapping("/api/lives/join")
	public ResponseEntity<LivePostResponseDto> joinLive(@RequestBody @Valid JoinLivePostRequestDto request) {
		try {
			Session session = openVidu.getActiveSession(request.getSessionId());

			if (session == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(null);
			}

			ConnectionProperties connectionProps = new ConnectionProperties.Builder()
				.type(ConnectionType.WEBRTC)
				.role(OpenViduRole.PUBLISHER)
				.build();

			Connection connection = session.createConnection(connectionProps);
			String token = connection.getToken();

			LivePostResponseDto livePostResponseDto = LivePostResponseDto.builder()
				.sessionId(request.getSessionId())
				.token(token)
				.build();

			return ResponseEntity.ok(livePostResponseDto);
		} catch (Exception e) {
			throw new RuntimeException("Error joining live session", e);
		}
	}
}
