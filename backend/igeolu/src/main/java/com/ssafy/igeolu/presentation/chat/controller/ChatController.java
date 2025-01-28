package com.ssafy.igeolu.presentation.chat.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.igeolu.domain.chatroom.dto.request.ChatRoomGetRequestDto;
import com.ssafy.igeolu.domain.chatroom.dto.response.ChatRoomGetResponseDto;
import com.ssafy.igeolu.facade.chatroom.service.ChatRoomFacadeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ChatController {

	private final SimpMessageSendingOperations template;
	private final ChatRoomFacadeService chatRoomFacadeService;

	@PostMapping("/create")
	public ResponseEntity<ChatRoomGetResponseDto> createChatRoom(
		@RequestBody ChatRoomGetRequestDto requestChatRoomDto) {
		return ResponseEntity.status(HttpStatus.CREATED)
			.body(chatRoomFacadeService.createChatRoom(requestChatRoomDto));
	}

	@GetMapping("/chatList")
	public ResponseEntity<List<ChatRoomGetResponseDto>> getChatRoomList() {
		List<ChatRoomGetResponseDto> responses = chatRoomFacadeService.findChatRoomList();
		return ResponseEntity.ok().body(responses);
	}
}