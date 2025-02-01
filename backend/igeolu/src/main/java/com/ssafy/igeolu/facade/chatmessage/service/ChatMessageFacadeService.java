package com.ssafy.igeolu.facade.chatmessage.service;

import com.ssafy.igeolu.facade.chatmessage.dto.request.ChatMessagePostRequestDto;
import com.ssafy.igeolu.facade.chatmessage.dto.response.ChatMessageGetResponseDto;
import com.ssafy.igeolu.facade.chatmessage.dto.response.ChatMessagePostResponseDto;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ChatMessageFacadeService {
	Flux<ChatMessageGetResponseDto> getChatMessageList(Integer id);

	Mono<ChatMessagePostResponseDto> saveChatMessage(ChatMessagePostRequestDto request);

	Mono<Void> markMessagesAsRead(Integer userId, Integer roomId);
}
