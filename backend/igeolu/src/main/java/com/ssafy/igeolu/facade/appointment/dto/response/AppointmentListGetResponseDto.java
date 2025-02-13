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

	@Schema(description = "공인중개사 id")
	private Integer realtorId;

	@Schema(description = "공인중개사 이름")
	private String realtorName;

	@Schema(description = "고객 id")
	private Integer memberId;

	@Schema(description = "고객 이름")
	private String memberName;
}
