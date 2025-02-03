package com.ssafy.igeolu.presentation.chatmessage.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.igeolu.facade.chatmessage.dto.request.ChatMessagePostRequestDto;
import com.ssafy.igeolu.facade.chatmessage.dto.response.ChatMessageGetResponseDto;
import com.ssafy.igeolu.facade.chatmessage.service.ChatMessageFacadeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
public class ChatMessageController {

	private final SimpMessageSendingOperations stompTemplate;
	private final ChatMessageFacadeService chatMessageFacadeService;

	// 이전 채팅 내용 조회
	@GetMapping("/api/chats/messages/room/{roomId}")
	public Mono<ResponseEntity<List<ChatMessageGetResponseDto>>> getMessages(@PathVariable("roomId") Integer roomId) {
		Flux<ChatMessageGetResponseDto> response = chatMessageFacadeService.getChatMessageList(roomId);
		return response.collectList().map(ResponseEntity::ok);
	}

	/**
	 * 메세지 송신 및 수신
	 * 1. front 에서 /chats 으로 websocket handshake(api 는 WebSocketConfig 에서 설정)
	 * 2. front 에서 /pub/chats/messages 로 해당 메서드 호출
	 * 3. front 에서 /sub/chats/{roomId} 로 보냄
	 */
	@MessageMapping("/chats/messages")
	public Mono<ResponseEntity<Void>> receiveMessage(@RequestBody ChatMessagePostRequestDto request) {
		return chatMessageFacadeService.saveChatMessage(request).flatMap(message -> {
			// 메시지를 해당 채팅방 구독자들에게 전송
			stompTemplate.convertAndSend("/sub/chats/" + request.getRoomId(), message);
			return Mono.just(ResponseEntity.ok().build());
		});
	}

	/**
	 * 사용자가 메시지를 읽었을 때 호출
	 */
	@Operation(summary = "메세지 마크", description = "사용자 id 와 방 id 를 이용해 사용자 읽음을 체크합니다..")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@PostMapping("/rooms/{roomId}/user/{userId}")
	public Mono<ResponseEntity<Void>> markMessagesAsRead(@PathVariable Integer roomId, @PathVariable Integer userId) {
		return chatMessageFacadeService.markMessagesAsRead(userId, roomId)
			.then(Mono.just(ResponseEntity.ok().build()));
	}
}
