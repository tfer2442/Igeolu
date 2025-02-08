package com.ssafy.igeolu.presentation.property.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.igeolu.facade.property.dto.request.PropertyPostRequestDto;
import com.ssafy.igeolu.facade.property.dto.request.PropertySearchGetRequestDto;
import com.ssafy.igeolu.facade.property.dto.request.PropertyUpdateRequestDto;
import com.ssafy.igeolu.facade.property.dto.response.PropertyGetResponseDto;
import com.ssafy.igeolu.facade.property.dto.response.PropertySearchGetResponseDto;
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

	@GetMapping("/search")
	public List<PropertySearchGetResponseDto> searchProperties(PropertySearchGetRequestDto request) {
		return propertyFacadeService.searchBy(request);
	}
}
