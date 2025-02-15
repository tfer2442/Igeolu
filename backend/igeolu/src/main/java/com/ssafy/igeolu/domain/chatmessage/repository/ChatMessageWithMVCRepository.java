package com.ssafy.igeolu.domain.chatmessage.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.igeolu.domain.chatmessage.entity.ChatMessageWithMVC;

@Repository
public interface ChatMessageWithMVCRepository extends JpaRepository<ChatMessageWithMVC, Integer> {
}
