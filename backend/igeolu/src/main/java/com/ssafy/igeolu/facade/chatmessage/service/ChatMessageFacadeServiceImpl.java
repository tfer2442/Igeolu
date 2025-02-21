package com.ssafy.igeolu.facade.chatmessage.service;

import com.ssafy.igeolu.domain.chatmessage.entity.ChatMessage;
import com.ssafy.igeolu.domain.chatmessage.entity.ChatMessageWithMVC;
import com.ssafy.igeolu.domain.chatmessage.service.ChatMessageService;
import com.ssafy.igeolu.facade.chatmessage.dto.request.ChatMessagePostRequestDto;
import com.ssafy.igeolu.facade.chatmessage.dto.response.ChatMessageGetResponseDto;
import com.ssafy.igeolu.facade.chatmessage.dto.response.ChatMessagePostResponseDto;
import com.ssafy.igeolu.facade.chatmessage.dto.response.ChatMessageWithMVCPostResponseDto;
import com.ssafy.igeolu.oauth.service.SecurityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class ChatMessageFacadeServiceImpl implements ChatMessageFacadeService {

    private final ChatMessageService chatMessageService;
    private final SecurityService securityService;

    @Override
    public Flux<ChatMessageGetResponseDto> getChatMessageList(Integer roomId) {
        Integer userId = securityService.getCurrentUser().getUserId();
        Flux<ChatMessage> chatMessages = chatMessageService.getChatMessageList(roomId, userId);

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

    // 부하 테스트용
    @Override
    public ChatMessageWithMVCPostResponseDto saveChatMessageWithMVC(ChatMessagePostRequestDto request) {

        ChatMessageWithMVC chatMessageWithMVC = ChatMessageWithMVC.builder()
                .roomId(request.getRoomId())
                .userId(request.getWriterId())
                .content(request.getContent())
                .senderType(request.getSenderType())
                .build();

        // DB에 저장
        ChatMessageWithMVC saved = chatMessageService.saveChatMessageWithMVC(chatMessageWithMVC);

        // Response DTO 생성
        return ChatMessageWithMVCPostResponseDto.builder()
                .messageId(saved.getId())
                .writerId(saved.getUserId())
                .content(saved.getContent())
                .senderType(saved.getSenderType())
                .createdAt(saved.getCreatedAt())
                .build();
    }
}
