package com.ssafy.igeolu.presentation.chatroom.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.igeolu.facade.chatroom.dto.request.ChatRoomListGetRequestDto;
import com.ssafy.igeolu.facade.chatroom.dto.request.ChatRoomPostRequestDto;
import com.ssafy.igeolu.facade.chatroom.dto.response.ChatRoomListGetResponseDto;
import com.ssafy.igeolu.facade.chatroom.dto.response.ChatRoomPostResponseDto;
import com.ssafy.igeolu.facade.chatroom.service.ChatRoomFacadeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chats")
public class ChatRoomController {

	private final ChatRoomFacadeService chatRoomFacadeService;

	@PostMapping("")
	public ResponseEntity<ChatRoomPostResponseDto> createChatRoom(
		@RequestBody ChatRoomPostRequestDto request) {
		ChatRoomPostResponseDto response = chatRoomFacadeService.createChatRoom(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@GetMapping("")
	public ResponseEntity<List<ChatRoomListGetResponseDto>> getChatRoomList(ChatRoomListGetRequestDto request) {
		List<ChatRoomListGetResponseDto> responses = chatRoomFacadeService.getChatRoomList(request);
		return ResponseEntity.ok().body(responses);
	}
}