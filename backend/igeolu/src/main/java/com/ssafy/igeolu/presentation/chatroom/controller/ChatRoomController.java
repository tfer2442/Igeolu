package com.ssafy.igeolu.presentation.chatroom.controller;

import com.ssafy.igeolu.facade.chatroom.dto.request.ChatRoomPostRequestDto;
import com.ssafy.igeolu.facade.chatroom.dto.response.ChatRoomListGetResponseDto;
import com.ssafy.igeolu.facade.chatroom.dto.response.ChatRoomPostResponseDto;
import com.ssafy.igeolu.facade.chatroom.service.ChatRoomFacadeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<List<ChatRoomListGetResponseDto>> getChatRoomList() {
        List<ChatRoomListGetResponseDto> responses = chatRoomFacadeService.getChatRoomList();
        return ResponseEntity.ok().body(responses);
    }

    @Operation(summary = "채팅방 나가기", description = "채팅을 나갑니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "정상 처리"),
    })
    @DeleteMapping("/{chatRoomId}/exit")
    public ResponseEntity<Void> deleteChatRoom(@PathVariable Integer chatRoomId) {
        chatRoomFacadeService.leaveChatRoom(chatRoomId);
        return ResponseEntity.noContent().build();
    }
}