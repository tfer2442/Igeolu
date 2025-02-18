package com.ssafy.igeolu.domain.chatmessage.service;

import com.ssafy.igeolu.domain.chatmessage.entity.ChatMessage;
import com.ssafy.igeolu.domain.chatmessage.entity.ChatMessageWithMVC;
import com.ssafy.igeolu.domain.chatmessage.entity.UserRoomStatus;
import com.ssafy.igeolu.domain.chatmessage.repository.ChatMessageRepository;
import com.ssafy.igeolu.domain.chatmessage.repository.ChatMessageWithMVCRepository;
import com.ssafy.igeolu.domain.chatmessage.repository.UserRoomStatusRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class ChatMessageServiceImpl implements ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final UserRoomStatusRepository userRoomStatusRepository;
    private final ChatMessageWithMVCRepository chatMessageWithMVCRepository;

    @Override
    public Flux<ChatMessage> getChatMessageList(Integer roomId, Integer userId) {
        return userRoomStatusRepository.findByUserIdAndRoomId(userId, roomId)
                .flatMapMany(userRoomStatus -> {
                    ObjectId lastExitMessageId = userRoomStatus.getLastExitRoomMessageId();

                    return lastExitMessageId == null
                            ? chatMessageRepository.findAllByRoomId(roomId) // 나간 적이 없으면 전체 메시지 반환
                            : chatMessageRepository.findAllByRoomIdAndIdGreaterThan(roomId, lastExitMessageId); // 나간 이후 메시지만 반환
                });

    }

    @Override
    public Mono<ChatMessage> saveChatMessage(ChatMessage chatMessage) {

        return chatMessageRepository.save(chatMessage);
    }

    /**
     * 메시지를 읽음 처리하는 메서드
     */
    @Override
    public Mono<Void> markMessagesAsRead(Integer userId, Integer roomId) {
        return chatMessageRepository.findFirstByRoomIdOrderByIdDesc(roomId) // 가장 최근 메시지 가져오기
                .flatMap(latestMessage -> userRoomStatusRepository.findByUserIdAndRoomId(userId, roomId)
                        .defaultIfEmpty(UserRoomStatus.builder()
                                .userId(userId)
                                .roomId(roomId)
                                .lastReadMessageId(null) // 처음 읽을 경우 null
                                .lastExitRoomMessageId(null)
                                .build())
                        .flatMap(userRoomStatus -> {
                            userRoomStatus = UserRoomStatus.builder()
                                    .id(userRoomStatus.getId())
                                    .userId(userId)
                                    .roomId(roomId)
                                    .lastReadMessageId(latestMessage.getId()) // 최신 메시지 ID로 업데이트
                                    .lastExitRoomMessageId(userRoomStatus.getLastExitRoomMessageId())
                                    .build();
                            return userRoomStatusRepository.save(userRoomStatus);
                        })
                ).then();
    }

    // 채팅방을 나갔을때 마지막으로 읽은 메세지 기록
    @Override
    public Mono<Void> markLastExitRoomMessage(Integer userId, Integer roomId) {
        return chatMessageRepository.findTopByRoomIdOrderByIdDesc(roomId) // 방의 가장 최근 메시지 가져오기
                .flatMap(latestMessage -> userRoomStatusRepository.findByUserIdAndRoomId(userId, roomId)
                        .defaultIfEmpty(UserRoomStatus.builder()
                                .userId(userId)
                                .roomId(roomId)
                                .lastReadMessageId(null) // 처음 나가는 경우 null
                                .lastExitRoomMessageId(null)
                                .build())
                        .flatMap(userRoomStatus -> {
                            userRoomStatus = UserRoomStatus.builder()
                                    .id(userRoomStatus.getId())
                                    .userId(userId)
                                    .roomId(roomId)
                                    .lastReadMessageId(userRoomStatus.getLastReadMessageId())
                                    .lastExitRoomMessageId(latestMessage.getId()) // 마지막 메시지 ID 업데이트
                                    .build();
                            return userRoomStatusRepository.save(userRoomStatus);
                        })
                ).then();
    }

    /**
     * 읽지 않은 메시지 개수를 조회하는 메서드
     */
    @Override
    public Mono<Long> countUnreadMessages(Integer userId, Integer roomId) {
        return userRoomStatusRepository.findByUserIdAndRoomId(userId, roomId)
                .flatMap(userRoomStatus ->
                        chatMessageRepository.countByRoomIdAndIdGreaterThan(roomId, userRoomStatus.getLastReadMessageId())
                )
                .defaultIfEmpty(0L); // 읽은 기록이 없으면 0 반환
    }

    /**
     * 채팅방 ID에 대한 마지막 메시지 가져오기
     */
    @Override
    public Mono<ChatMessage> getLastMessage(Integer roomId) {
        return chatMessageRepository.findTopByRoomIdOrderByIdDesc(roomId);
    }

    @Override
    public Mono<Void> deleteAllMessagesByRoomId(Integer roomId) {
        return chatMessageRepository.deleteByRoomId(roomId);
    }

    @Override
    public ChatMessageWithMVC saveChatMessageWithMVC(ChatMessageWithMVC chatMessageWithMVC) {
        return chatMessageWithMVCRepository.save(chatMessageWithMVC);
    }
}
