package com.ssafy.igeolu.facade.appointment.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AppointmentListGetResponseDto {

	private LocalDateTime scheduledAt;

	// 약속방 정보
	private String title;

	// 약속 상대방 이름
	private String opponentName;
}
