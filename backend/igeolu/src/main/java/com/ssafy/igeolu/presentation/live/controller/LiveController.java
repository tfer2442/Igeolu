package com.ssafy.igeolu.presentation.live.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class LiveController {
	private final LiveFacadeService liveFacadeService;

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
