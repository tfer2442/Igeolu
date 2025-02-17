package com.ssafy.igeolu.domain.chatroom.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.chatroom.entity.ChatRoom;
import com.ssafy.igeolu.domain.chatroom.entity.RoomStatus;
import com.ssafy.igeolu.domain.chatroom.repository.ChatRoomRepository;
import com.ssafy.igeolu.domain.user.entity.Role;
import com.ssafy.igeolu.domain.user.entity.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatRoomServiceImpl implements ChatRoomService {

	private final ChatRoomRepository chatRoomRepository;

	@Override
	public ChatRoom getChatRoom(Integer id) {
		return chatRoomRepository.findById(id).orElseThrow();
	}

	@Override
	public ChatRoom createChatRoom(User member, User realtor) {

		if (chatRoomRepository.existsByMemberAndRealtor(member, realtor)) {
			throw new RuntimeException("이미 채팅방이 존재합니다.");
		}

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

	@Override
	public void leaveChatRoom(ChatRoom chatRoom) {
		chatRoomRepository.delete(chatRoom);
	}

	@Override
	public void updateChatRoomStatus(ChatRoom chatRoom, User user) {

		// 현재 고객만 남아있는 상태의 경우, 고객이 검증후 나가기
		if (chatRoom.getRoomStatus() == RoomStatus.MEMBER && chatRoom.getMember().equals(user)) {
			chatRoom.setRoomStatus(RoomStatus.NONE);
		}

		// 현재 중개사만 남아있는 경우, 중개사 검증후 나가기
		if (chatRoom.getRoomStatus() == RoomStatus.REALTOR && chatRoom.getRealtor().equals(user)) {
			chatRoom.setRoomStatus(RoomStatus.NONE);
		}

		// 둘다 남아있는경우, 로그인 유저에따라 상태변경
		if (chatRoom.getRoomStatus() == RoomStatus.BOTH) {
			if (chatRoom.getMember().equals(user)) {
				chatRoom.setRoomStatus(RoomStatus.REALTOR);
			}

			if (chatRoom.getRealtor().equals(user)) {
				chatRoom.setRoomStatus(RoomStatus.MEMBER);
			}
		}
	}
}
