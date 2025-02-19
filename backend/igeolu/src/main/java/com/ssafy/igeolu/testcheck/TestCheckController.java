package com.ssafy.igeolu.testcheck;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.igeolu.domain.dongcodes.service.DongcodesService;
import com.ssafy.igeolu.domain.user.entity.Role;
import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.facade.chatmessage.dto.request.ChatMessagePostRequestDto;
import com.ssafy.igeolu.facade.chatmessage.dto.response.ChatMessageWithMVCPostResponseDto;
import com.ssafy.igeolu.facade.chatmessage.service.ChatMessageFacadeService;
import com.ssafy.igeolu.facade.property.dto.request.DongcodesSearchGetRequestDto;
import com.ssafy.igeolu.facade.property.dto.response.DongcodesSearchGetResponseDto;
import com.ssafy.igeolu.oauth.util.JWTUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
public class TestCheckController {
	private final DongcodesService dongcodesService;
	private final ChatMessageFacadeService chatMessageFacadeService;
	private final SimpMessageSendingOperations stompTemplate;
	private final JWTUtil jwtUtil;

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

	// WebFlux 스타일
	@Operation(summary = "채팅 메시지 전송 With WebFlux(부하 테스트 비교용)")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@PostMapping("/api/pub/chats/messages/flux")
	public Mono<ResponseEntity<Void>> receiveMessage(@RequestBody ChatMessagePostRequestDto request) {
		// DB에 메시지 저장
		return chatMessageFacadeService.saveChatMessage(request)
			.flatMap(savedMessage -> {
				// STOMP를 통해 해당 채팅방 구독자들에게 메시지 전송
				stompTemplate.convertAndSend("/api/sub/chats/" + request.getRoomId(), savedMessage);
				// HTTP 200 OK 반환
				return Mono.just(ResponseEntity.ok().build());
			});
	}

	// WebMVC 스타일
	@Operation(summary = "채팅 메시지 전송 With WebMVC(부하 테스트 비교용)")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@PostMapping("/api/pub/chats/messages/mvc")
	public ResponseEntity<Void> receiveMessageWithMVC(@RequestBody ChatMessagePostRequestDto request) {
		// DB에 메시지 저장
		ChatMessageWithMVCPostResponseDto savedMessage = chatMessageFacadeService.saveChatMessageWithMVC(request);

		// 채팅방 구독자들에게 메시지 전송
		stompTemplate.convertAndSend("/api/sub/chats/" + request.getRoomId(), savedMessage);

		return ResponseEntity.ok().build();
	}

	@Operation(summary = "공인중개사/일반 로그인 (테스트)")
	@PostMapping("/api/test/login")
	public ResponseEntity<Void> login(@RequestParam String role,
		@RequestBody TestLoginPostRequestDto testLoginPostRequestDto, HttpServletResponse httpServletResponse) {
		User user = null;

		if (role.equals("realtor")) { // 공인중개사
			String inputId = testLoginPostRequestDto.getId();
			String inputPassword = testLoginPostRequestDto.getPassword();

			if (inputId.equals("realtor1") && inputPassword.equals("realtor1")) { // 조대성
				user = User.builder()
					.id(32)
					.role(Role.ROLE_REALTOR)
					.build();
			} else if (inputId.equals("realtor2") && inputPassword.equals("realtor2")) { // 오승우
				user = User.builder()
					.id(33)
					.role(Role.ROLE_REALTOR)
					.build();
			} else if (inputId.equals("realtor3") && inputPassword.equals("realtor3")) { // 최재영
				user = User.builder()
					.id(38)
					.role(Role.ROLE_REALTOR)
					.build();
			} else if (inputId.equals("realtor4") && inputPassword.equals("realtor4")) { // 박진훈
				user = User.builder()
					.id(39)
					.role(Role.ROLE_INCOMPLETE_REALTOR)
					.build();
			} else {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
			}
		}


		if (role.equals("member")) {
			if (!(testLoginPostRequestDto.getId().equals("consultantlove12") && testLoginPostRequestDto.getPassword()
				.equals("coachlove12"))) {

				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
			}

			user = User.builder()
				.id(35)
				.role(Role.ROLE_MEMBER)
				.build();
		}

		setNewAccessTokenCookie(user, httpServletResponse);
		return ResponseEntity.ok().build();
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
