package com.ssafy.igeolu.domain.chatmessage.repository;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

import com.ssafy.igeolu.domain.chatmessage.entity.UserRoomStatus;

import reactor.core.publisher.Mono;

public interface UserRoomStatusRepository extends ReactiveMongoRepository<UserRoomStatus, String> {
	// 특정 사용자의 읽음 상태 조회
	Mono<UserRoomStatus> findByUserIdAndRoomId(Integer userId, Integer roomId);
}