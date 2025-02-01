package com.ssafy.igeolu.facade.chatmessage.dto.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ChatMessageGetResponseDto {

	private Long writerId;

	private String content;
	private Date createdAt;
}
