package com.ssafy.igeolu.domain.chatroom.repository;

import com.ssafy.igeolu.domain.chatroom.entity.ChatRoom;
import com.ssafy.igeolu.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer> {

    List<ChatRoom> findByMember(User member);

    List<ChatRoom> findByRealtor(User realtor);

    Optional<ChatRoom> findByMemberAndRealtor(User member, User realtor);
}
