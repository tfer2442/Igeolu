package com.ssafy.igeolu.domain.chatroom.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.igeolu.domain.chatroom.entity.ChatRoom;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

}
