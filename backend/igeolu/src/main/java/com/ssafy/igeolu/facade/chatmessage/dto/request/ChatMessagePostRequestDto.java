package com.ssafy.igeolu.facade.chatmessage.dto.request;

import lombok.Data;

@Data
public class ChatMessagePostRequestDto {

	private Integer roomId;
	private Integer writerId;
	private String content;
}
