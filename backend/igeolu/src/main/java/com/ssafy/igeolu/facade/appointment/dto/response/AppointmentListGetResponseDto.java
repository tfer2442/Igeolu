package com.ssafy.igeolu.facade.appointment.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AppointmentListGetResponseDto {

	@Schema(description = "약속 id")
	private Integer appointmentId;

	@Schema(description = "스케줄 날짜", example = "yyyy-MM-dd(E) HH:mm")
	private String scheduledAt;

	@Schema(description = "약속 내용")
	private String title;

	@Schema(description = "약속 상대방 id")
	private Integer opponentId;

	@Schema(description = "약속 상대방 이름")
	private String opponentName;
}
