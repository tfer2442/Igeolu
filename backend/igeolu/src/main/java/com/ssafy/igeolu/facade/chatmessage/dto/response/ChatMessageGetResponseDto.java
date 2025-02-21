package com.ssafy.igeolu.facade.chatmessage.dto.response;

import java.time.LocalDateTime;

import com.ssafy.igeolu.domain.chatmessage.entity.SenderType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ChatMessageGetResponseDto {

	private Integer writerId;
	private SenderType senderType;

	private String content;
	private LocalDateTime createdAt;
}
