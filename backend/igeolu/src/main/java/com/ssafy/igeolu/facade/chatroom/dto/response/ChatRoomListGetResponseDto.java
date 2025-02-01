package com.ssafy.igeolu.facade.chatroom.dto.response;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ChatRoomListGetResponseDto {

	private Long roomId;
	private Long userId;
	private String userName;
	private String userProfileUrl;
	private LocalDate createdAt;

	private String lastMessage;
	private Integer unreadCount;
}
