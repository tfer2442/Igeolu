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

	@Schema(description = "스케줄 날짜", example = "yyyy-MM-dd(E) HH:mm")
	private String scheduledAt;

	@Schema(description = "알림 내용")
	private String message;

	@Schema(description = "약속 상대방 id")
	private Integer opponentId;

	@Schema(description = "약속 상대방 이름")
	private String opponentName;
}
