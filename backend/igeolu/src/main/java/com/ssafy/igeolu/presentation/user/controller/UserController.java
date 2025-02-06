package com.ssafy.igeolu.presentation.user.controller;

import java.util.Collection;
import java.util.Iterator;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.igeolu.facade.user.dto.response.MeGetResponseDto;
import com.ssafy.igeolu.oauth.dto.CustomOAuth2User;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

	@Operation(summary = "자신 정보 조회", description = "로그인한 사용자의 정보를 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@GetMapping("/me")
	public ResponseEntity<MeGetResponseDto> getMe(@AuthenticationPrincipal CustomOAuth2User principal) {
		Integer userId = principal.getUserId();

		Collection<? extends GrantedAuthority> authorities = principal.getAuthorities();
		Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
		GrantedAuthority auth = iterator.next();
		String role = auth.getAuthority();

		MeGetResponseDto meGetResponseDto = MeGetResponseDto.builder()
			.userId(userId)
			.role(role)
			.build();

		return ResponseEntity.ok(meGetResponseDto);
	}
}
