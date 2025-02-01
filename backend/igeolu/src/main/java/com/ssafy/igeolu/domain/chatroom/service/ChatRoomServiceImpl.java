package com.ssafy.igeolu.domain.chatroom.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.chatroom.entity.ChatRoom;
import com.ssafy.igeolu.domain.chatroom.repository.ChatRoomRepository;
import com.ssafy.igeolu.domain.user.entity.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatRoomServiceImpl implements ChatRoomService {

	private final ChatRoomRepository chatRoomRepository;

	@Override
	public ChatRoom createChatRoom(User member, User realtor) {

		ChatRoom chatRoom = ChatRoom.builder()
			.member(member)
			.realtor(realtor)
			.build();

		return chatRoomRepository.save(chatRoom);
	}

	@Override
	public List<ChatRoom> getChatRoomList(User member) {
		List<ChatRoom> chatRoomList = chatRoomRepository.findByMember(member);
		return chatRoomList;
	}
}
