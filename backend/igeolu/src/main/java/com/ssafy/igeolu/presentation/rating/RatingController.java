package com.ssafy.igeolu.presentation.rating;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.igeolu.facade.rating.dto.request.RatingPostRequestDto;
import com.ssafy.igeolu.facade.rating.dto.response.RatingEligibilityGetResponseDto;
import com.ssafy.igeolu.facade.rating.service.RatingFacadeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class RatingController {
	private final RatingFacadeService ratingFacadeService;

	@Operation(summary = "평점 매기기", description = "라이브 끝난 후 공인중개사 평점 매기기")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리")
	})
	@PostMapping("/api/lives/{liveId}/rating")
	public ResponseEntity<String> registerRating(@PathVariable String liveId,
		@RequestBody @Valid RatingPostRequestDto ratingPostRequestDto) {
		ratingFacadeService.registerRating(liveId, ratingPostRequestDto);

		return ResponseEntity.ok().build();
	}

	@Operation(
		summary = "평점 등록 가능 여부 조회",
		description = "라이브 종료 후, 현재 사용자가 평점 모달창을 띄울 자격(최초 참여자 여부 등)이 있는지 확인"
	)
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리")
	})
	@GetMapping("/api/lives/{liveId}/rating/eligibility")
	public ResponseEntity<RatingEligibilityGetResponseDto> checkRatingEligibility(@PathVariable String liveId) {
		RatingEligibilityGetResponseDto ratingEligibilityGetResponseDto = ratingFacadeService.checkRatingEligibility(
			liveId);

		return ResponseEntity.ok(ratingEligibilityGetResponseDto);
	}
}
