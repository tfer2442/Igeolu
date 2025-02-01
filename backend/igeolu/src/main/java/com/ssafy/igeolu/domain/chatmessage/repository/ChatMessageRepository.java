package com.ssafy.igeolu.domain.chatmessage.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.ssafy.igeolu.domain.chatmessage.entity.ChatMessage;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ChatMessageRepository extends ReactiveMongoRepository<ChatMessage, String> {
	// 특정 채팅방의 모든 메시지 조회
	Flux<ChatMessage> findAllByRoomId(Long roomId);

	// 특정 채팅방에서 가장 최근 메시지 조회
	Mono<ChatMessage> findFirstByRoomIdOrderByIdDesc(Long roomId);

	// 읽지 않은 메시지 개수 조회
	Mono<Long> countByRoomIdAndIdGreaterThan(Long roomId, ObjectId lastReadMessageId);
}
