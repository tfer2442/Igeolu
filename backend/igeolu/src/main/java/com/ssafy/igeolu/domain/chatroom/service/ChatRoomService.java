package com.ssafy.igeolu.domain.chatroom.service;

import java.util.List;

import com.ssafy.igeolu.domain.chatroom.entity.ChatRoom;
import com.ssafy.igeolu.domain.user.entity.User;

public interface ChatRoomService {

	ChatRoom getChatRoom(Integer id);

	ChatRoom createChatRoom(User member, User realtor);

	List<ChatRoom> getChatRoomList(User user);

	User getOpponentUser(ChatRoom chatRoom, User user);
}
