package com.ssafy.igeolu.presentation.Option;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.igeolu.facade.property.dto.response.OptionListGetResponseDto;
import com.ssafy.igeolu.facade.property.service.PropertyFacadeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/options")
public class OptionController {
	private final PropertyFacadeService propertyFacadeService;

	@GetMapping("")
	public ResponseEntity<List<OptionListGetResponseDto>> getOptionList() {
		List<OptionListGetResponseDto> options = propertyFacadeService.getOptionList();
		return ResponseEntity.ok(options);
	}
}
