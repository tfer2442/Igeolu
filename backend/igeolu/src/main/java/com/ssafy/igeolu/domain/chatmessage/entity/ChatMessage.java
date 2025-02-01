package com.ssafy.igeolu.domain.chatmessage.entity;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Document(collection = "chat_message") // 실제 몽고 DB 컬렉션 이름
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
	@Id
	private ObjectId id;
	private Integer roomId;
	private String content;

	private Integer writerId;

	@CreatedDate
	private LocalDateTime createdAt;
}