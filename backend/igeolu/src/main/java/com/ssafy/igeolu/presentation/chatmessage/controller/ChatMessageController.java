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

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chats/messages")
public class ChatMessageController {

	private final SimpMessageSendingOperations template;
	private final ChatMessageFacadeService chatMessageFacadeService;

	// 이전 채팅 내용 조회
	@GetMapping("/room/{roomId}")
	public Mono<ResponseEntity<List<ChatMessageGetResponseDto>>> getMessages(@PathVariable("roomId") Long roomId) {
		Flux<ChatMessageGetResponseDto> response = chatMessageFacadeService.getChatMessageList(roomId);
		return response.collectList().map(ResponseEntity::ok);
	}

	//메세지 송신 및 수신
	@MessageMapping("")
	public Mono<ResponseEntity<Void>> receiveMessage(@RequestBody ChatMessagePostRequestDto request) {
		return chatMessageFacadeService.saveChatMessage(request).flatMap(message -> {
			// 메시지를 해당 채팅방 구독자들에게 전송
			template.convertAndSend("/sub/chats/" + request.getRoomId(), message);
			return Mono.just(ResponseEntity.ok().build());
		});
	}

	/**
	 * 사용자가 메시지를 읽었을 때 호출
	 */
	// @PostMapping("/rooms/{roomId}/user/{userId}")
	// public Mono<ResponseEntity<Void>> markMessagesAsRead(@PathVariable Long roomId, @PathVariable Long userId) {
	// 	return chatMessageService.markMessagesAsRead(userId, roomId)
	// 		.then(Mono.just(ResponseEntity.ok().build()));
	// }
}
