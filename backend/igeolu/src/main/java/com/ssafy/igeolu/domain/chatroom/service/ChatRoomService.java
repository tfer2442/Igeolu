package com.ssafy.igeolu.domain.chatroom.service;

import java.util.List;

import com.ssafy.igeolu.domain.chatroom.dto.request.ChatRoomGetRequestDto;
import com.ssafy.igeolu.domain.chatroom.entity.ChatRoom;

public interface ChatRoomService {

	ChatRoom createChatRoom(ChatRoomGetRequestDto requestChatRoomDto);

	List<ChatRoom> findChatRoomList();
}
