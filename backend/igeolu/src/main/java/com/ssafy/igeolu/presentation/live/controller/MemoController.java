package com.ssafy.igeolu.presentation.live.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.igeolu.facade.live.dto.request.MemoPutRequestDto;
import com.ssafy.igeolu.facade.live.service.LiveFacadeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MemoController {
	private final LiveFacadeService liveFacadeService;

	@Operation(summary = "라이브 매물 메모 작성", description = "라이브 매물 메모 작성")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@PutMapping("/api/liveProperties/{livePropertyId}/memo")
	public ResponseEntity<String> editMemo(@PathVariable Integer livePropertyId,
		@RequestBody @Valid MemoPutRequestDto memoPutRequestDto) {
		liveFacadeService.editMemo(livePropertyId, memoPutRequestDto);

		return ResponseEntity.ok().build();
	}
}
