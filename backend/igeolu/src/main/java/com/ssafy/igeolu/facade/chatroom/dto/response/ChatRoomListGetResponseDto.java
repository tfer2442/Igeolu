package com.ssafy.igeolu.facade.chatroom.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ChatRoomListGetResponseDto {

	private Integer roomId;
	private Integer userId;
	private String userName;
	private String userProfileUrl;
	private LocalDateTime updatedAt;

	private String lastMessage;
	private Long unreadCount;
}
