package com.ssafy.igeolu.facade.notification.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class AppointmentNotificationResponseDto {
	@Schema(description = "알림 id")
	private Integer notificationId;

	@Schema(description = "약속 id")
	private Integer appointmentId;

	@Schema(description = "알림 내용")
	private String message;

	@Schema(description = "")
	private Integer userId;
	private Integer opponentUserId;
}
