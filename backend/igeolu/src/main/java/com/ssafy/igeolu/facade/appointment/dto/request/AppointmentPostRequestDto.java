package com.ssafy.igeolu.facade.appointment.dto.request;

import java.time.LocalDateTime;

import com.ssafy.igeolu.domain.appointment.entity.AppointmentType;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AppointmentPostRequestDto {

	@Schema(description = "약속 시각")
	private LocalDateTime scheduledAt;

	@Schema(description = "약속 내용")
	private String title;

	@Schema(description = "약속 타입")
	@NotNull
	private AppointmentType appointmentType;

	// 상대방
	@Schema(description = "고객 id")
	private Integer memberId;

	// 약속 관련 채팅방
	@Schema(description = "채팅방 id")
	private Integer chatRoomId;
}
