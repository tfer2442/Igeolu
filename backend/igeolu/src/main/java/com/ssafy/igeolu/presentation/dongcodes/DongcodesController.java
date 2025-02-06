	package com.ssafy.igeolu.presentation.dongcodes;

	import java.util.List;

	import org.springframework.http.ResponseEntity;
	import org.springframework.web.bind.annotation.GetMapping;
	import org.springframework.web.bind.annotation.RequestMapping;
	import org.springframework.web.bind.annotation.RequestParam;
	import org.springframework.web.bind.annotation.RestController;

	import com.ssafy.igeolu.facade.property.dto.response.DongResponseDto;
	import com.ssafy.igeolu.facade.property.dto.response.PropertyGetResponseDto;
	import com.ssafy.igeolu.facade.property.service.PropertyFacadeService;

	import io.swagger.v3.oas.annotations.Operation;
	import io.swagger.v3.oas.annotations.responses.ApiResponse;
	import io.swagger.v3.oas.annotations.responses.ApiResponses;
	import lombok.RequiredArgsConstructor;

	@RestController
	@RequiredArgsConstructor
	@RequestMapping("/api")
	public class DongcodesController {
		private final PropertyFacadeService propertyFacadeService;

		@Operation(summary = "시도", description = "시도 조회")
		@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "정상 처리"),
			@ApiResponse(responseCode = "404", description = "매물을 찾을 수 없습니다.")
		})
		@GetMapping("/sidos")
		public ResponseEntity<List<String>> getSidoList() {
			List<String> sidoList = propertyFacadeService.getSidoList();
			return ResponseEntity.ok(sidoList);
		}


		@Operation(summary = "군구", description = "군구 조회")
		@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "정상 처리"),
			@ApiResponse(responseCode = "404", description = "매물을 찾을 수 없습니다.")
		})
		@GetMapping("/guguns")
		public ResponseEntity<List<String>> getGugunList(
			@RequestParam String sidoName
		) {
			List<String> gugunList = propertyFacadeService.getGugunList(sidoName);
			return ResponseEntity.ok(gugunList);
		}

		@Operation(summary = "동", description = "동 조회")
		@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "정상 처리"),
			@ApiResponse(responseCode = "404", description = "매물을 찾을 수 없습니다.")
		})
		@GetMapping("/dongs")
		public ResponseEntity<List<DongResponseDto>> getDongList(
			@RequestParam String sidoName,
			@RequestParam String gugunName
		) {
			List<DongResponseDto> dongList = propertyFacadeService.getDongList(sidoName, gugunName);
			return ResponseEntity.ok(dongList);
		}
	}
