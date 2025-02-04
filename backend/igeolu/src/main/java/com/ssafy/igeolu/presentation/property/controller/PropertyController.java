package com.ssafy.igeolu.presentation.property.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.igeolu.facade.property.dto.request.PropertyPostRequestDto;
import com.ssafy.igeolu.facade.property.dto.response.PropertyGetResponseDto;
import com.ssafy.igeolu.facade.property.service.PropertyFacadeService;

import io.swagger.v3.oas.annotations.Operation;
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
	@PostMapping("")
	public ResponseEntity<Void> createProperty(@RequestBody PropertyPostRequestDto propertyPostRequestDto) {
		propertyFacadeService.createProperty(propertyPostRequestDto);
		return new ResponseEntity<>(HttpStatus.CREATED);
	}


}
