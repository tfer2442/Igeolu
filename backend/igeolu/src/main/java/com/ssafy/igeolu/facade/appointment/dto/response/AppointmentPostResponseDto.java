package com.ssafy.igeolu.facade.appointment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AppointmentPostResponseDto {
	Integer appointmentId;
}
