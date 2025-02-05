package com.ssafy.igeolu.facade.appointment.dto.request;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class AppointmentPostRequestDto {

	private LocalDateTime scheduledAt;
	private String title;

	// 본인
	private Integer userId;

	// 상대방
	private Integer opponentUserId;

	// 약속 관련 채팅방
	private Integer chatRoomId;
}
