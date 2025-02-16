package com.ssafy.igeolu.presentation.test;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.igeolu.domain.dongcodes.service.DongcodesService;
import com.ssafy.igeolu.facade.chatmessage.dto.request.ChatMessagePostRequestDto;
import com.ssafy.igeolu.facade.chatmessage.dto.response.ChatMessageWithMVCPostResponseDto;
import com.ssafy.igeolu.facade.chatmessage.service.ChatMessageFacadeService;
import com.ssafy.igeolu.facade.property.dto.request.DongcodesSearchGetRequestDto;
import com.ssafy.igeolu.facade.property.dto.response.DongcodesSearchGetResponseDto;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
public class TestController {
	private final DongcodesService dongcodesService;
	private final ChatMessageFacadeService chatMessageFacadeService;
	private final SimpMessageSendingOperations stompTemplate;

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
}
