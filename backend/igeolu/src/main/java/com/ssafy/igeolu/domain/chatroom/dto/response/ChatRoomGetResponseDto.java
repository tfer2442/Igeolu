package com.ssafy.igeolu.domain.chatroom.dto.response;

import lombok.Data;

@Data
public class ChatRoomGetResponseDto {

	private Long id;
	private String title;
	private String updateDate;

	// 채팅방에 표시되는 마지막 메세지
	private String lastMessage;

	// 읽지 않은 메세지 총 개수
	private int unreadCount;
}
