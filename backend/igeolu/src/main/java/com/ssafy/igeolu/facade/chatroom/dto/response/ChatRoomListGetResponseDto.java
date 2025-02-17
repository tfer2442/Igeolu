package com.ssafy.igeolu.facade.chatroom.dto.response;

import java.time.LocalDateTime;

import com.ssafy.igeolu.domain.chatroom.entity.RoomStatus;
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
	private RoomStatus roomStatus;

	private String lastMessage;
	private Long unreadCount;
}
