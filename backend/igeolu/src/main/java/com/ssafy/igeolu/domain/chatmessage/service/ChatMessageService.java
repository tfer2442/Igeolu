package com.ssafy.igeolu.domain.chatmessage.service;

import com.ssafy.igeolu.domain.chatmessage.entity.ChatMessage;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ChatMessageService {
	Flux<ChatMessage> getChatMessageList(Long id);

	Mono<ChatMessage> saveChatMessage(ChatMessage chatMessage);
}
