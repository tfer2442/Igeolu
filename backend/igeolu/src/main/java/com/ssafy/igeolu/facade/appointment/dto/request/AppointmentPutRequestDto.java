package com.ssafy.igeolu.facade.appointment.dto.request;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Future;
import lombok.Data;

@Data
public class AppointmentPutRequestDto {

	@Schema(description = "변경할 약속 시각")
	@Future(message = "약속 시각은 현재 이후의 시간이어야 합니다.")
	private LocalDateTime scheduledAt;

	@Schema(description = "변경할 약속 내용")
	private String title;
}
