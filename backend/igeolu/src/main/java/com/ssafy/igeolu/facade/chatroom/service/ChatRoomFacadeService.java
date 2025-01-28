package com.ssafy.igeolu.facade.chatroom.service;

import java.util.List;

import com.ssafy.igeolu.domain.chatroom.dto.request.ChatRoomGetRequestDto;
import com.ssafy.igeolu.domain.chatroom.dto.response.ChatRoomGetResponseDto;

public interface ChatRoomFacadeService {

	ChatRoomGetResponseDto createChatRoom(ChatRoomGetRequestDto requestChatRoomDto);

	List<ChatRoomGetResponseDto> findChatRoomList();
}
