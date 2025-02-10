package com.ssafy.igeolu.presentation.live.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.igeolu.facade.live.dto.request.JoinLivePostRequestDto;
import com.ssafy.igeolu.facade.live.dto.request.LivePropertyStartPostRequestDto;
import com.ssafy.igeolu.facade.live.dto.request.LivePropertyStopPostRequestDto;
import com.ssafy.igeolu.facade.live.dto.request.MemoPutRequestDto;
import com.ssafy.igeolu.facade.live.dto.request.StartLivePostRequestDto;
import com.ssafy.igeolu.facade.live.dto.response.LiveGetResponseDto;
import com.ssafy.igeolu.facade.live.dto.response.LivePostResponseDto;
import com.ssafy.igeolu.facade.live.dto.response.LivePropertyGetResponseDto;
import com.ssafy.igeolu.facade.live.service.LiveFacadeService;
import com.ssafy.igeolu.infra.naver.ClovaSpeechClient;

import io.openvidu.java.client.OpenVidu;
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
	private final ClovaSpeechClient clovaSpeechClient;
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

	@Operation(summary = "라이브 참여", description = "라이브를 참여합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리")
	})
	@PostMapping("/api/lives/join")
	public ResponseEntity<LivePostResponseDto> joinLive(@RequestBody @Valid JoinLivePostRequestDto request) {
		return ResponseEntity.ok(liveFacadeService.joinLive(request));
	}

	@Operation(summary = "라이브 매물 시작", description = "해당 매물 소개를 시작합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
		@ApiResponse(responseCode = "400", description = "라이브 매물을 시작할 수 없습니다.")
	})
	@PostMapping("/api/live-properties/{livePropertyId}/start")
	public ResponseEntity<Recording> startLiveProperty(@PathVariable Integer livePropertyId,
		@RequestBody LivePropertyStartPostRequestDto requestDto) {

		return ResponseEntity.ok(liveFacadeService.startLiveProperty(livePropertyId, requestDto));
	}

	@Operation(summary = "라이브 매물 종료", description = "해당 매물 소개를 종료합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
		// @ApiResponse(responseCode = "400", description = "라이브 매물을 시작할 수 없습니다.")
	})
	@PostMapping("/api/live-properties/{livePropertyId}/stop")
	public ResponseEntity<String> stopLiveProperty(@PathVariable Integer livePropertyId,
		@RequestBody LivePropertyStopPostRequestDto requestDto) {

		liveFacadeService.stopLiveProperty(livePropertyId, requestDto);
		return ResponseEntity.ok().build();
	}

	@Operation(summary = "라이브 매물 메모 작성", description = "라이브 매물 메모 작성")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@PutMapping("/api/live-properties/{livePropertyId}/memo")
	public ResponseEntity<String> editMemo(@PathVariable Integer livePropertyId,
		@RequestBody @Valid MemoPutRequestDto memoPutRequestDto) {
		liveFacadeService.editMemo(livePropertyId, memoPutRequestDto);

		return ResponseEntity.ok().build();
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
	public ResponseEntity<List<LivePropertyGetResponseDto>> getLiveProperties(@PathVariable String liveId) {
		return ResponseEntity.ok(liveFacadeService.getProperties(liveId));
	}

	@Operation(summary = "라이브 매물 녹화 단일 조회", description = "라이브에서 본 매물의 녹화 정보")
	@GetMapping("/api/recordings/{recordingId}")
	public ResponseEntity<Recording> getRecording(@PathVariable String recordingId) {
		return ResponseEntity.ok(liveFacadeService.getRecording(recordingId));
	}

	// @Operation(summary = "라이브 매물 요약", description = "라이브 매물 요약")
	// @PostMapping("/api/live-properties/{livePropertyId}/summary")
	// public ResponseEntity<String> getLivePropertySummary(@PathVariable Integer livePropertyId) {
	// 	return ResponseEntity.ok(liveFacadeService.getLivePropertySummary(livePropertyId));
	// }

	// @PostMapping("/api/live-proierties/summary/example")
	// public ResponseEntity<String> getExample(String text) {
	// 	return ResponseEntity.ok(liveFacadeService.createLivePropertySummary(text));
	// }
}
