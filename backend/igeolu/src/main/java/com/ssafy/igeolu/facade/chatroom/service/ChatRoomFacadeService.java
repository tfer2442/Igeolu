package com.ssafy.igeolu.facade.chatroom.service;

import java.util.List;

import com.ssafy.igeolu.facade.chatroom.dto.request.ChatRoomListGetRequestDto;
import com.ssafy.igeolu.facade.chatroom.dto.request.ChatRoomPostRequestDto;
import com.ssafy.igeolu.facade.chatroom.dto.response.ChatRoomListGetResponseDto;
import com.ssafy.igeolu.facade.chatroom.dto.response.ChatRoomPostResponseDto;

public interface ChatRoomFacadeService {

	ChatRoomPostResponseDto createChatRoom(ChatRoomPostRequestDto request);

	List<ChatRoomListGetResponseDto> getChatRoomList(ChatRoomListGetRequestDto request);

	void leaveChatRoom(Integer chatRoomId);
}
