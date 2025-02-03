package com.ssafy.igeolu.facade.chatmessage.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ChatMessageGetResponseDto {

	private Integer writerId;

	private String content;
	private LocalDateTime createdAt;
}
