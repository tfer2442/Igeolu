package com.ssafy.igeolu.facade.chatroom.service;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.igeolu.domain.chatmessage.entity.ChatMessage;
import com.ssafy.igeolu.domain.chatmessage.service.ChatMessageService;
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
	private final ChatMessageService chatMessageService;
	private final UserService userService;

	@Override
	public ChatRoomPostResponseDto createChatRoom(ChatRoomPostRequestDto request) {
		// TODO: memberId 는 나중에 JWT Token 에서 가져와서 검증
		Integer memberId = request.getMemberId();
		Integer realtorId = request.getRealtorId();

		User member = userService.getUserById(memberId);
		User realtor = userService.getUserById(realtorId);

		ChatRoom chatRoom = chatRoomService.createChatRoom(member, realtor);
		return ChatRoomPostResponseDto.builder()
			.id(chatRoom.getId())
			.build();
	}

	@Override
	public List<ChatRoomListGetResponseDto> getChatRoomList(ChatRoomListGetRequestDto request) {
		// TODO: userId 는 나중에 JWT Token 에서 가져와서 검증
		Integer userId = request.getUserId();

		User user = userService.getUserById(userId);

		List<ChatRoom> chatRoomList = chatRoomService.getChatRoomList(user);

		return chatRoomList.stream()
			.map(cr -> {

					User opponentUser = chatRoomService.getOpponentUser(cr, user);
					Long unreadCount = chatMessageService.countUnreadMessages(user.getId(), cr.getId()).block();
					ChatMessage lastMessage = chatMessageService.getLastMessage(cr.getId()).block();

					// lastMessage가 null인 경우를 걸러냄
					// 대화방을 만들었지만 메세지를 시작하지 않은 경우임
					if (lastMessage == null) {
						return null;
					}

					return ChatRoomListGetResponseDto.builder()
						.roomId(cr.getId())
						.userId(opponentUser.getId())
						.userName(opponentUser.getUsername())
						.userProfileUrl(opponentUser.getProfileFilePath())
						.unreadCount(unreadCount)
						.lastMessage(lastMessage.getContent())
						.updatedAt(lastMessage.getCreatedAt())
						.build();
				}
			)
			.filter(Objects::nonNull) // null인 항목들을 걸러냄
			.sorted((o1, o2) -> o2.getUpdatedAt().compareTo(o1.getUpdatedAt()))
			.toList();
	}
}
