package com.ssafy.igeolu.facade.appointment.dto.request;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class AppointmentPostRequestDto {

	@Schema(description = "약속 시각")
	private LocalDateTime scheduledAt;

	@Schema(description = "약속 내용")
	private String title;

	// 상대방
	@Schema(description = "고객 id")
	private Integer memberId;

	// 약속 관련 채팅방
	@Schema(description = "채팅방 id")
	private Integer chatRoomId;
}
