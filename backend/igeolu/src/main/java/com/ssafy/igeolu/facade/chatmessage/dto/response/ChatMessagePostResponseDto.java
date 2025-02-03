package com.ssafy.igeolu.facade.chatmessage.dto.response;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ChatMessagePostResponseDto {

	private ObjectId messageId;
	private Integer writerId;

	private String content;
	private LocalDateTime createdAt;
}
