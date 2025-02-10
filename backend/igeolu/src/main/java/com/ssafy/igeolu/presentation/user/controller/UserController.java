package com.ssafy.igeolu.presentation.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.domain.user.service.UserService;
import com.ssafy.igeolu.facade.user.dto.response.MeGetResponseDto;
import com.ssafy.igeolu.facade.user.dto.response.UserInfoGetResponseDto;
import com.ssafy.igeolu.facade.user.service.UserFacadeService;
import com.ssafy.igeolu.oauth.service.SecurityService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
	private final UserFacadeService userFacadeService;
	private final UserService userService;
	private final SecurityService securityService;

	@Operation(summary = "자신 정보 조회", description = "로그인한 사용자의 정보를 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@GetMapping("/me")
	public ResponseEntity<MeGetResponseDto> getMe() {
		return ResponseEntity.ok(userFacadeService.getMe());
	}

	@Operation(summary = "자신 정보 조회", description = "로그인한 사용자의 정보를 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@GetMapping("/{userId}/info")
	@ResponseBody
	public ResponseEntity<UserInfoGetResponseDto> getUserInfo(@PathVariable Integer userId) {
		return ResponseEntity.ok(userFacadeService.getUserInfo(userId));
	}

	@PostMapping("/me/profile")
	public ResponseEntity<UserInfoGetResponseDto> updateProfileImage(
		@RequestParam("file") MultipartFile file) {
		User currentUser = securityService.getUserEntity();
		userService.updateUserProfileImage(currentUser, file);
		return ResponseEntity.ok(userService.getUserInfo(currentUser.getId()));
	}
}
