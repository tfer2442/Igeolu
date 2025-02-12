package com.ssafy.igeolu.facade.notification.dto.response;

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
	private Integer appointmentId;
	private String message;
	private Integer userId;
	private Integer opponentUserId;
}
