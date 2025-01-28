package com.ssafy.igeolu.facade.chatroom.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.chatroom.dto.request.ChatRoomGetRequestDto;
import com.ssafy.igeolu.domain.chatroom.dto.response.ChatRoomGetResponseDto;

@Service
public class ChatRoomFacadeServiceImpl implements ChatRoomFacadeService {

	@Override
	public ChatRoomGetResponseDto createChatRoom(ChatRoomGetRequestDto requestChatRoomDto) {
		return null;
	}

	@Override
	public List<ChatRoomGetResponseDto> findChatRoomList() {
		return List.of();
	}
}
