package com.ssafy.igeolu.presentation.live.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.igeolu.facade.live.dto.request.JoinLivePostRequestDto;
import com.ssafy.igeolu.facade.live.dto.request.StartLivePostRequestDto;
import com.ssafy.igeolu.facade.live.dto.response.LiveGetResponseDto;
import com.ssafy.igeolu.facade.live.dto.response.LivePostResponseDto;
import com.ssafy.igeolu.facade.live.service.LiveFacadeService;
import com.ssafy.igeolu.facade.property.dto.response.PropertyGetResponseDto;

import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Recording;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class LiveController {
	private final LiveFacadeService liveFacadeService;
	private final OpenViduService openviduService;

	@Operation(summary = "라이브 생성", description = "라이브를 생성합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리")
	})
	@PostMapping("/api/lives")
	public ResponseEntity<LivePostResponseDto> startLive(
		@RequestBody @Valid StartLivePostRequestDto startLivePostRequestDto) {

		return ResponseEntity.ok(liveFacadeService.startLive(startLivePostRequestDto));
	}

	@Operation(summary = "라이브 참여", description = "라이브를 참여합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리")
	})
	@PostMapping("/api/lives/join")
	public ResponseEntity<LivePostResponseDto> joinLive(@RequestBody @Valid JoinLivePostRequestDto request) {
		return ResponseEntity.ok(liveFacadeService.joinLive(request));
	}

	@PostMapping("/start")
	public ResponseEntity<?> startPropertyRecording(
		@RequestBody Map<String, String> params,
		@CookieValue(name = OpenViduService.MODERATOR_TOKEN_NAME, defaultValue = "") String moderatorToken) {

		String sessionId = params.get("sessionId");
		String propertyId = params.get("propertyId");

		// 녹화 시작 권한 확인 (moderator 권한)
		if (!openviduService.isModeratorSessionValid(sessionId, moderatorToken)) {
			String message = "Permission denied for starting recording in session " + sessionId;
			return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);
		}

		// 새 매물에 대한 녹화 시작
		try {
			Recording newRecording = openviduService.startRecording(sessionId);
			// 녹화 id와 매물 id를 저장
			PropertyRecordingInfo propertyRecording = new PropertyRecordingInfo(propertyId, newRecording.getId());
			ongoingRecordings.put(sessionId, propertyRecording);
			return new ResponseEntity<>(newRecording, HttpStatus.OK);
		} catch (OpenViduJavaClientException | OpenViduHttpException e) {
			e.printStackTrace();
			return new ResponseEntity<>("Error starting recording", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * 매물 소개 종료 시 호출 (현재 진행 중인 녹화를 종료)
	 *
	 * 요청 JSON 예)
	 * {
	 *   "sessionId": "SESSION_ID_123",
	 *   "propertyId": "PROPERTY_456"  // (선택적으로 전달하여 검증 가능)
	 * }
	 *
	 * @param params JSON 요청 파라미터
	 * @param moderatorToken 쿠키에서 전달되는 moderator 토큰
	 * @return 해당 세션의 종료된 녹화 리스트 또는 오류 메시지
	 */
	@PostMapping("/stop")
	public ResponseEntity<?> stopPropertyRecording(
		@RequestBody Map<String, String> params,
		@CookieValue(name = OpenViduService.MODERATOR_TOKEN_NAME, defaultValue = "") String moderatorToken) {

		String sessionId = params.get("sessionId");
		String propertyId = params.get("propertyId");

		// if (!CALL_RECORDING.equalsIgnoreCase("ENABLED")) {
		// 	String message = "Recording is disabled";
		// 	return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);
		// }

		if (!openviduService.isModeratorSessionValid(sessionId, moderatorToken)) {
			String message = "Permission denied for stopping recording in session " + sessionId;
			return new ResponseEntity<>(message, HttpStatus.FORBIDDEN);
		}

		// if (!ongoingRecordings.containsKey(sessionId)) {
		// 	String message = "No ongoing recording found for session " + sessionId;
		// 	return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
		// }

		PropertyRecordingInfo recordingInfo = ongoingRecordings.get(sessionId);

		// // (선택사항) 요청된 propertyId와 현재 진행중인 녹화의 propertyId가 일치하는지 검증
		// if (propertyId != null && !propertyId.equals(recordingInfo.getPropertyId())) {
		// 	String message = "Property ID mismatch for ongoing recording";
		// 	return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
		// }

		try {
			Recording stoppedRecording = openviduService.stopRecording(recordingInfo.getRecordingId());
			// 종료된 녹화 정보를 기록 리스트에 추가
			sessionRecordings.computeIfAbsent(sessionId, k -> new ArrayList<>()).add(recordingInfo);
			ongoingRecordings.remove(sessionId);
			// // 종료된 녹화 정보 목록을 반환 (필요에 따라 반환 형식을 조정)
			// List<PropertyRecordingInfo> finishedRecordings = sessionRecordings.get(sessionId);
			return new ResponseEntity<>(finishedRecordings, HttpStatus.OK);
		} catch (OpenViduJavaClientException | OpenViduHttpException e) {
			e.printStackTrace();
			return new ResponseEntity<>("Error stopping recording", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Operation(summary = "내가 본 라이브 목록", description = "내가 본 라이브 목록")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리")
	})
	@GetMapping("/api/lives")
	public ResponseEntity<List<LiveGetResponseDto>> getLives() {
		return ResponseEntity.ok(liveFacadeService.getLives());
	}

	@Operation(summary = "라이브에서 본 매물 목록", description = "내가 라이브에서 본 매물 목록")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리")
	})
	@GetMapping("/api/lives/{liveId}/properties")
	public ResponseEntity<List<PropertyGetResponseDto>> getLiveProperties(@PathVariable String liveId) {
		return ResponseEntity.ok(liveFacadeService.getProperties(liveId));
	}
}
