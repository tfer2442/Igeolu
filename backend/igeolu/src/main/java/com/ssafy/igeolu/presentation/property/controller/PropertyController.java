package com.ssafy.igeolu.presentation.property.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.igeolu.domain.dongcodes.service.DongcodesService;
import com.ssafy.igeolu.facade.property.dto.request.DongcodesSearchGetRequestDto;
import com.ssafy.igeolu.facade.property.dto.request.PropertyPostRequestDto;
import com.ssafy.igeolu.facade.property.dto.request.PropertySearchGetRequestDto;
import com.ssafy.igeolu.facade.property.dto.request.PropertyUpdateRequestDto;
import com.ssafy.igeolu.facade.property.dto.request.SigunguSearchGetRequestDto;
import com.ssafy.igeolu.facade.property.dto.response.DongcodesSearchGetResponseDto;
import com.ssafy.igeolu.facade.property.dto.response.PropertyGetResponseDto;
import com.ssafy.igeolu.facade.property.dto.response.PropertySearchGetResponseDto;
import com.ssafy.igeolu.facade.property.dto.response.SigunguSearchGetResponseDto;
import com.ssafy.igeolu.facade.property.service.PropertyFacadeService;
import com.ssafy.igeolu.global.exception.CustomException;
import com.ssafy.igeolu.global.exception.ErrorCode;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/properties")
public class PropertyController {
	private final PropertyFacadeService propertyFacadeService;
	private final DongcodesService dongcodesService;

	@Operation(summary = "매물 등록", description = "매물을 등록합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Void> createProperty(
		@RequestPart PropertyPostRequestDto propertyPostRequestDto,
		@RequestPart(required = false) List<MultipartFile> images) {
		propertyFacadeService.createProperty(propertyPostRequestDto, images);
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@Operation(summary = "중개인 매물 조회 or 동 매물 조회", description = "중개인 매물을 조회하거나 동 매물을 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@GetMapping("")
	public ResponseEntity<List<PropertyGetResponseDto>> getProperties(
		@Schema(type = "string", example = "1111010100")
		@RequestParam(required = false) String dongcode,
		@RequestParam(required = false) Integer userId
	) {
		List<PropertyGetResponseDto> properties;

		if (dongcode != null) {
			properties = propertyFacadeService.getPropertiesByDongcode(dongcode);
		} else if (userId != null) {
			properties = propertyFacadeService.getProperties(userId);
		} else {
			throw new CustomException(ErrorCode.INVALID_PARAMETER);
		}

		return ResponseEntity.ok(properties);
	}

	@Operation(summary = "매물 상세 조회", description = "매물 ID로 상세 정보를 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
		@ApiResponse(responseCode = "404", description = "매물을 찾을 수 없습니다.")
	})
	@GetMapping("/{propertyId}")
	public ResponseEntity<PropertyGetResponseDto> getPropertyDetail(@PathVariable Integer propertyId) {
		PropertyGetResponseDto property = propertyFacadeService.getProperty(propertyId);
		return ResponseEntity.ok(property);
	}

	@Operation(summary = "매물 수정", description = "매물 정보를 수정합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
		@ApiResponse(responseCode = "404", description = "매물을 찾을 수 없습니다.")
	})
	@PutMapping(value = "/{propertyId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Void> updateProperty(@PathVariable Integer propertyId,
		@RequestPart PropertyUpdateRequestDto requestDto,
		@RequestPart(required = false) List<MultipartFile> images) {
		propertyFacadeService.updateProperty(propertyId, requestDto, images);
		return ResponseEntity.ok().build();
	}

	@Operation(summary = "매물 삭제", description = "매물 정보를 삭제합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "204", description = "정상 처리"),
		@ApiResponse(responseCode = "404", description = "매물을 찾을 수 없습니다.")
	})
	@DeleteMapping("/{propertyId}")
	public ResponseEntity<Void> deleteProperty(@PathVariable Integer propertyId) {
		propertyFacadeService.deleteProperty(propertyId);
		return ResponseEntity.noContent().build();
	}

	@Operation(summary = "매물 검색",
		description = "매물 정보를 검색합니다. "
			+ "swagger 에서 options list 값이 string 으로 변경되는 버그가 있습니다."
			+ "swagger 에서 options 값에 대한 테스트는 할 수 없으며 postman 으로는 가능합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@GetMapping("/search")
	public List<PropertySearchGetResponseDto> searchProperties(PropertySearchGetRequestDto request) {
		return propertyFacadeService.searchBy(request);
	}

	@Operation(summary = "시군구 검색어 자동 완성",
		description = "시군구에 대한 검색어 자동 완성 리스트를 반환합니다."
			+ "가중치를 부여하여 가장 적합한 시군구를 우선으로 정렬해서 반환합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@GetMapping("/sigungu/search")
	public List<SigunguSearchGetResponseDto> searchProperties(SigunguSearchGetRequestDto request) {
		return propertyFacadeService.searchSigunguBy(request);
	}

	@Operation(summary = "시군구 검색어 자동 완성 (부하 테스트 비교용)",
		description = "시군구에 대한 검색어 자동 완성 리스트를 반환합니다."
			+ "가중치를 부여하여 가장 적합한 시군구를 우선으로 정렬해서 반환합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@GetMapping("/sigungu/search/test")
	public List<DongcodesSearchGetResponseDto> searchPropertiesTest(DongcodesSearchGetRequestDto request) {
		return dongcodesService.searchDongcodes(request.getKeyword(), request.toPageable());
	}
}
