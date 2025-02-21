package com.ssafy.igeolu.facade.notification.dto.response;

import java.time.LocalDateTime;

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

	@Schema(description = "스케줄 날짜")
	private LocalDateTime scheduledAt;

	@Schema(description = "알림 발생일")
	private LocalDateTime createdAt;

	@Schema(description = "약속 제목")
	private String title;

	@Schema(description = "알림 내용")
	private String message;

	@Schema(description = "읽음 여부")
	private Boolean isRead;
}
