package com.ssafy.igeolu.facade.chatmessage.service;

import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.chatmessage.entity.ChatMessage;
import com.ssafy.igeolu.domain.chatmessage.service.ChatMessageService;
import com.ssafy.igeolu.facade.chatmessage.dto.request.ChatMessagePostRequestDto;
import com.ssafy.igeolu.facade.chatmessage.dto.response.ChatMessageGetResponseDto;
import com.ssafy.igeolu.facade.chatmessage.dto.response.ChatMessagePostResponseDto;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class ChatMessageFacadeServiceImpl implements ChatMessageFacadeService {

    private final ChatMessageService chatMessageService;

    @Override
    public Flux<ChatMessageGetResponseDto> getChatMessageList(Integer roomId) {
        Flux<ChatMessage> chatMessages = chatMessageService.getChatMessageList(roomId);

        return chatMessages.map(o -> ChatMessageGetResponseDto.builder()
                .writerId(o.getUserId())
                .senderType(o.getSenderType())
                .content(o.getContent())
                .createdAt(o.getCreatedAt())
                .build());
    }

    @Override
    public Mono<ChatMessagePostResponseDto> saveChatMessage(ChatMessagePostRequestDto request) {

        ChatMessage chatMessage = ChatMessage.builder()
                .roomId(request.getRoomId())
                .userId(request.getWriterId())
                .content(request.getContent())
                .senderType(request.getSenderType())
                .build();

        return chatMessageService.saveChatMessage(chatMessage)
                .map(m -> ChatMessagePostResponseDto.builder()
                        .messageId(m.getId())
                        .writerId(m.getUserId())
                        .content(m.getContent())
                        .senderType(m.getSenderType())
                        .createdAt(m.getCreatedAt())
                        .build());
    }

    @Override
    public Mono<Void> markMessagesAsRead(Integer userId, Integer roomId) {
        return chatMessageService.markMessagesAsRead(userId, roomId);
    }

}
