package com.ssafy.igeolu.domain.chatmessage.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.ssafy.igeolu.domain.chatmessage.entity.ChatMessage;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ChatMessageRepository extends ReactiveMongoRepository<ChatMessage, String> {
	// 특정 채팅방의 모든 메시지 조회
	Flux<ChatMessage> findAllByRoomId(Integer roomId);

	// 특정 id 이후 모든 메시지 조회
	Flux<ChatMessage> findAllByRoomIdAndIdGreaterThan(Integer roomId, ObjectId lastExitRoomMessageId);

	// 특정 채팅방에서 가장 최근 메시지 조회
	Mono<ChatMessage> findFirstByRoomIdOrderByIdDesc(Integer roomId);

	// 읽지 않은 메시지 개수 조회
	Mono<Long> countByRoomIdAndIdGreaterThan(Integer roomId, ObjectId lastReadMessageId);

	// ObjectId의 타임스탬프를 기준으로 내림차순 정렬하여 가장 최근 메시지 가져오기
	Mono<ChatMessage> findTopByRoomIdOrderByIdDesc(Integer roomId);

	// 채팅방 메세지 삭제
	Mono<Void> deleteByRoomId(Integer roomId);

	Mono<ChatMessage> findTopByRoomIdAndIdGreaterThanOrderByIdDesc(Integer roomId, ObjectId lastExitMessageId);

}
