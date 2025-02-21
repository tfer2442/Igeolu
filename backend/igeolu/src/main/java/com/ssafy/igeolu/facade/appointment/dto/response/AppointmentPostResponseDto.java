package com.ssafy.igeolu.facade.appointment.dto.response;

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
}
