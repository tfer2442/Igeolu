package com.ssafy.igeolu.domain.chatmessage.service;

import com.ssafy.igeolu.domain.chatmessage.entity.ChatMessage;
import com.ssafy.igeolu.domain.chatmessage.entity.ChatMessageWithMVC;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ChatMessageService {
	Flux<ChatMessage> getChatMessageList(Integer roomId, Integer userId);

	Mono<ChatMessage> saveChatMessage(ChatMessage chatMessage);

	Mono<Void> markMessagesAsRead(Integer userId, Integer roomId);

	Mono<Void> markLastExitRoomMessage(Integer userId, Integer roomId);

	Mono<Long> countUnreadMessages(Integer userId, Integer roomId);

	Mono<ChatMessage> getLastMessage(Integer userId, Integer roomId);

	Mono<Void> deleteAllMessagesByRoomId(Integer roomId);

	// 채팅 메시지 With MVC (부하 테스트용)
	ChatMessageWithMVC saveChatMessageWithMVC(ChatMessageWithMVC chatMessageWithMVC);
}
