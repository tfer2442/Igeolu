package com.ssafy.igeolu.facade.appointment.dto.response;

import java.time.LocalDateTime;

import com.ssafy.igeolu.domain.appointment.entity.AppointmentType;

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

	@Schema(description = "스케줄 날짜")
	private LocalDateTime scheduledAt;

	@Schema(description = "약속 내용")
	private String title;

	@Schema(description = "약속 타입", example = "LIVE", allowableValues = {"LIVE", "COMMON"})
	AppointmentType appointmentType;

	@Schema(description = "공인중개사 id")
	private Integer realtorId;

	@Schema(description = "공인중개사 이름")
	private String realtorName;

	@Schema(description = "고객 id")
	private Integer memberId;

	@Schema(description = "고객 이름")
	private String memberName;
}
