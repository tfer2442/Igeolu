package com.ssafy.igeolu.facade.appointment.dto.response;

import com.ssafy.igeolu.domain.appointment.entity.AppointmentType;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AppointmentPostResponseDto {
	@Schema(description = "약속 id")
	Integer appointmentId;

	@Schema(description = "약속 타입", example = "LIVE", allowableValues = {"LIVE", "COMMON"})
	AppointmentType appointmentType;
}
