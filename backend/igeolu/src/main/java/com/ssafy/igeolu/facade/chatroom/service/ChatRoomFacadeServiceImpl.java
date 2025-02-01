package com.ssafy.igeolu.facade.chatroom.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.igeolu.domain.chatroom.entity.ChatRoom;
import com.ssafy.igeolu.domain.chatroom.service.ChatRoomService;
import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.domain.user.service.UserService;
import com.ssafy.igeolu.facade.chatroom.dto.request.ChatRoomListGetRequestDto;
import com.ssafy.igeolu.facade.chatroom.dto.request.ChatRoomPostRequestDto;
import com.ssafy.igeolu.facade.chatroom.dto.response.ChatRoomListGetResponseDto;
import com.ssafy.igeolu.facade.chatroom.dto.response.ChatRoomPostResponseDto;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatRoomFacadeServiceImpl implements ChatRoomFacadeService {

	private final ChatRoomService chatRoomService;
	private final UserService userService;

	@Override
	public ChatRoomPostResponseDto createChatRoom(ChatRoomPostRequestDto request) {
		// TODO: memberId 는 나중에 JWT Token 에서 가져와서 검증
		Long memberId = request.getMemberId();
		Long realtorId = request.getRealtorId();

		User member = userService.getUserById(memberId);
		User realtor = userService.getUserById(realtorId);

		ChatRoom chatRoom = chatRoomService.createChatRoom(member, realtor);
		return ChatRoomPostResponseDto.builder()
			.id(chatRoom.getId())
			.build();
	}

	@Override
	public List<ChatRoomListGetResponseDto> getChatRoomList(ChatRoomListGetRequestDto request) {
		// TODO: memberId 는 나중에 JWT Token 에서 가져와서 검증
		Long memberId = request.getMemberId();

		User member = userService.getUserById(memberId);

		List<ChatRoom> chatRoomList = chatRoomService.getChatRoomList(member);
		return List.of();
	}
}
