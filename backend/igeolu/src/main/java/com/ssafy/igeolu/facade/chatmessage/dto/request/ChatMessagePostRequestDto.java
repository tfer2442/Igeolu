package com.ssafy.igeolu.facade.chatmessage.dto.request;

import com.ssafy.igeolu.domain.chatmessage.entity.SenderType;

import lombok.Data;

@Data
public class ChatMessagePostRequestDto {

	private Integer roomId;
	private Integer writerId;
	private String content;
	private SenderType senderType;
}
