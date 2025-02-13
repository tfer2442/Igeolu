package com.ssafy.igeolu.facade.appointment.dto.request;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class AppointmentPutRequestDto {

	@Schema(description = "변경할 약속 시각")
	private LocalDateTime scheduledAt;

	@Schema(description = "변경할 약속 내용")
	private String title;
}
