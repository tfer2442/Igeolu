package com.ssafy.igeolu.facade.chatmessage.dto.response;

import java.util.Date;

import org.bson.types.ObjectId;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ChatMessagePostResponseDto {

	private ObjectId messageId;
	private Long writerId;

	private String content;
	private Date createdAt;
}
