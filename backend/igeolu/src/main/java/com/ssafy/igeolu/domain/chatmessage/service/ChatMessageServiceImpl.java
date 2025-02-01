package com.ssafy.igeolu.domain.chatmessage.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.igeolu.domain.chatmessage.entity.ChatMessage;
import com.ssafy.igeolu.domain.chatmessage.entity.UserRoomStatus;
import com.ssafy.igeolu.domain.chatmessage.repository.ChatMessageRepository;
import com.ssafy.igeolu.domain.chatmessage.repository.UserRoomStatusRepository;
import com.ssafy.igeolu.facade.chatmessage.dto.response.ChatMessagePostResponseDto;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatMessageServiceImpl implements ChatMessageService {

	private final ChatMessageRepository chatMessageRepository;
	private final UserRoomStatusRepository userRoomStatusRepository;

	public Flux<ChatMessage> getChatMessageList(Long id) {

		return chatMessageRepository.findAllByRoomId(id);
	}

	public Mono<ChatMessage> saveChatMessage(ChatMessage chatMessage) {

		return chatMessageRepository.save(chatMessage);
	}

	/**
	 * 메시지를 읽음 처리하는 메서드
	 */
	public Mono<Void> markMessagesAsRead(Long userId, Long roomId) {
		return chatMessageRepository.findFirstByRoomIdOrderByIdDesc(roomId) // 가장 최근 메시지 가져오기
			.flatMap(latestMessage -> userRoomStatusRepository.findByUserIdAndRoomId(userId, roomId)
				.defaultIfEmpty(UserRoomStatus.builder()
					.userId(userId)
					.roomId(roomId)
					.lastReadMessageId(null) // 처음 읽을 경우 null
					.build())
				.flatMap(userRoomStatus -> {
					userRoomStatus = UserRoomStatus.builder()
						.id(userRoomStatus.getId())
						.userId(userId)
						.roomId(roomId)
						.lastReadMessageId(latestMessage.getId()) // 최신 메시지 ID로 업데이트
						.build();
					return userRoomStatusRepository.save(userRoomStatus);
				})
			).then();
	}

	/**
	 * 읽지 않은 메시지 개수를 조회하는 메서드
	 */
	public Mono<Long> countUnreadMessages(Long userId, Long roomId) {
		return userRoomStatusRepository.findByUserIdAndRoomId(userId, roomId)
			.flatMap(userRoomStatus ->
				chatMessageRepository.countByRoomIdAndIdGreaterThan(roomId, userRoomStatus.getLastReadMessageId())
			)
			.defaultIfEmpty(0L); // 읽은 기록이 없으면 0 반환
	}
}
