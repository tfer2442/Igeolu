package com.ssafy.igeolu.facade.chatmessage.dto.request;

import lombok.Data;

@Data
public class ChatMessagePostRequestDto {

	private Long roomId;
	private Long writerId;
	private String content;
}
