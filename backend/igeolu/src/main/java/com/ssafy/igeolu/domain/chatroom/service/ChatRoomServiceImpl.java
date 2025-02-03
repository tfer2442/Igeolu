package com.ssafy.igeolu.domain.chatroom.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.chatroom.entity.ChatRoom;
import com.ssafy.igeolu.domain.chatroom.repository.ChatRoomRepository;
import com.ssafy.igeolu.domain.user.entity.Role;
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
	public List<ChatRoom> getChatRoomList(User user) {

		if (user.getRole() == Role.ROLE_MEMBER) {
			return chatRoomRepository.findByMember(user);
		}

		if (user.getRole() == Role.ROLE_REALTOR) {
			return chatRoomRepository.findByRealtor(user);
		}

		throw new RuntimeException("잘못된 유저 역할을 가진 접근입니다.");
	}

	@Override
	public User getOpponentUser(ChatRoom chatRoom, User user) {
		if (chatRoom.getMember().equals(user)) {
			return chatRoom.getRealtor();
		}

		if (chatRoom.getRealtor().equals(user)) {
			return chatRoom.getMember();
		}

		throw new RuntimeException("잘못된 상대방 입니다.");
	}
}
