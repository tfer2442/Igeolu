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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chats")
public class ChatRoomController {

	private final ChatRoomFacadeService chatRoomFacadeService;

	@Operation(summary = "채팅방 생성", description = "채팅방을 생성합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@PostMapping("")
	public ResponseEntity<ChatRoomPostResponseDto> createChatRoom(
		@RequestBody ChatRoomPostRequestDto request) {
		ChatRoomPostResponseDto response = chatRoomFacadeService.createChatRoom(request);
		return ResponseEntity.ok().body(response);
	}

	@Operation(summary = "채팅방 리스트 조회", description = "사용자의 채팅방 리스트를 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@GetMapping("")
	public ResponseEntity<List<ChatRoomListGetResponseDto>> getChatRoomList(ChatRoomListGetRequestDto request) {
		List<ChatRoomListGetResponseDto> responses = chatRoomFacadeService.getChatRoomList(request);
		return ResponseEntity.ok().body(responses);
	}
}