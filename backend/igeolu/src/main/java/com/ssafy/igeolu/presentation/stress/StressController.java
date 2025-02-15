package com.ssafy.igeolu.presentation.stress;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.igeolu.domain.dongcodes.service.DongcodesService;
import com.ssafy.igeolu.facade.property.dto.request.DongcodesSearchGetRequestDto;
import com.ssafy.igeolu.facade.property.dto.response.DongcodesSearchGetResponseDto;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class StressController {
	private final DongcodesService dongcodesService;

	@Operation(summary = "시군구 검색어 자동 완성 (부하 테스트 비교용)",
		description = "시군구에 대한 검색어 자동 완성 리스트를 반환합니다."
			+ "가중치를 부여하여 가장 적합한 시군구를 우선으로 정렬해서 반환합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@GetMapping("/api/properties/sigungu/search/test")
	public List<DongcodesSearchGetResponseDto> searchPropertiesTest(DongcodesSearchGetRequestDto request) {
		return dongcodesService.searchDongcodes(request.getKeyword(), request.toPageable());
	}
}
