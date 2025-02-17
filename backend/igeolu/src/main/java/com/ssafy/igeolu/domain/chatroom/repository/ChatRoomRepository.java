package com.ssafy.igeolu.domain.chatroom.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.igeolu.domain.chatroom.entity.ChatRoom;
import com.ssafy.igeolu.domain.user.entity.User;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer> {

	List<ChatRoom> findByMember(User member);

	List<ChatRoom> findByRealtor(User realtor);

	Boolean existsByMemberAndRealtor(User member, User realtor);

}
