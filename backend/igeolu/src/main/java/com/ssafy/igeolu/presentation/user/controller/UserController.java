package com.ssafy.igeolu.presentation.user.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.domain.user.service.UserService;
import com.ssafy.igeolu.facade.user.dto.request.RealtorInfoPostRequestDto;
import com.ssafy.igeolu.facade.user.dto.request.RealtorInfoUpdateRequestDto;
import com.ssafy.igeolu.facade.user.dto.response.MeGetResponseDto;
import com.ssafy.igeolu.facade.user.dto.response.RealtorInfoGetResponseDto;
import com.ssafy.igeolu.facade.user.dto.response.UserInfoGetResponseDto;
import com.ssafy.igeolu.facade.user.service.UserFacadeService;
import com.ssafy.igeolu.oauth.service.SecurityService;
import com.ssafy.igeolu.oauth.util.JWTUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
	private final UserFacadeService userFacadeService;
	private final UserService userService;
	private final SecurityService securityService;
	private final JWTUtil jwtUtil;

	@Operation(summary = "자신 로그인 정보 조회", description = "로그인한 사용자의 정보를 조회합니다. (프로필 X, 기본정보만)")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@GetMapping("/me")
	public ResponseEntity<MeGetResponseDto> getMe() {
		return ResponseEntity.ok(userFacadeService.getMe());
	}

	@Operation(summary = "유저 정보 조회", description = "사용자의 정보를 조회합니다.")
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

	@Operation(summary = "추가 정보 기입", description = "공인중개사의 추가 정보를 기입합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@PostMapping("/me/info")
	public ResponseEntity<Void> addInfo(@RequestBody RealtorInfoPostRequestDto request,
		HttpServletResponse httpServletResponse) {
		User user = userFacadeService.addInfo(request);
		setNewAccessTokenCookie(user, httpServletResponse);
		return ResponseEntity.ok().build();
	}

	@Operation(summary = "공인중개사 정보 수정", description = "공인중개사의 정보를 수정합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@PutMapping("/{userId}/realtor")
	public ResponseEntity<Void> updateRealtorInfo(@PathVariable Integer userId,
		@RequestBody RealtorInfoUpdateRequestDto requestDto) {
		userFacadeService.updateRealtorInfo(requestDto, userId);
		return ResponseEntity.ok().build();
	}

	@Operation(summary = "동 공인중개사 리스트", description = "동네의 공인중개사의 정보를 반환합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@GetMapping("/{dongcode}/realtors")
	public ResponseEntity<List<RealtorInfoGetResponseDto>> getDongRealtorList(@PathVariable String dongcode) {
		return ResponseEntity.ok(userFacadeService.getDongRealtorList(dongcode));
	}

	@Operation(summary = "공인중개사 리스트", description = "공인중개사의 리스트를 반환합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@GetMapping("/realtors")
	public ResponseEntity<List<RealtorInfoGetResponseDto>> getRealtorList() {
		return ResponseEntity.ok(userFacadeService.getRealtorList());
	}

	@Operation(summary = "공인중개사 단일 조회", description = "공인중개사의 정보를 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@GetMapping("/{userId}/realtor")
	public ResponseEntity<RealtorInfoGetResponseDto> getRealtorInfo(@PathVariable Integer userId) {
		return ResponseEntity.ok(userFacadeService.getRealtorDetail(userId));
	}

	public void setNewAccessTokenCookie(User user, HttpServletResponse httpServletResponse) {

		String role = user.getRole().name();
		Integer userId = user.getId();

		String token = jwtUtil.createJwt(userId, role, 14 * 24 * 60 * 60 * 1000L); // 14일

		httpServletResponse.addCookie(createCookie("Authorization", token));
	}

	private Cookie createCookie(String key, String value) {

		Cookie cookie = new Cookie(key, value);
		cookie.setMaxAge(14 * 24 * 60 * 60); // 14일
		cookie.setSecure(true);
		cookie.setAttribute("SameSite", "None");
		cookie.setPath("/");
		cookie.setHttpOnly(true);

		return cookie;
	}
}
