package com.ssafy.igeolu.domain.chatroom.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.igeolu.domain.chatroom.dto.request.ChatRoomGetRequestDto;
import com.ssafy.igeolu.domain.chatroom.entity.ChatRoom;
import com.ssafy.igeolu.domain.chatroom.repository.ChatRoomRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatRoomServiceImpl implements ChatRoomService {

	private final ChatRoomRepository chatRoomRepository;

	@Override
	public ChatRoom createChatRoom(ChatRoomGetRequestDto requestChatRoomDto) {
		return null;
	}

	@Override
	public List<ChatRoom> findChatRoomList() {
		return List.of();
	}
}
