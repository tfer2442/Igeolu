package com.ssafy.igeolu.presentation.user.controller;

import com.ssafy.igeolu.facade.user.dto.request.RealtorInfoPostRequestDto;
import com.ssafy.igeolu.global.exception.CheckRoleAdvice;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.igeolu.facade.user.dto.response.MeGetResponseDto;
import com.ssafy.igeolu.facade.user.service.UserFacadeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
	private final UserFacadeService userFacadeService;

	@Operation(summary = "자신 정보 조회", description = "로그인한 사용자의 정보를 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@GetMapping("/me")
	public ResponseEntity<MeGetResponseDto> getMe() {
		return ResponseEntity.ok(userFacadeService.getMe());
	}

	@PostMapping(CheckRoleAdvice.ADD_ADDITIONAL_INFO_URL)
	public ResponseEntity<Void> addInfo(@RequestBody RealtorInfoPostRequestDto request) {
		userFacadeService.addInfo(request);
		return ResponseEntity.ok().build();
	}
}
