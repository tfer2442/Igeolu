package com.ssafy.igeolu.facade.appointment.dto.request;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class AppointmentPutRequestDto {

	private LocalDateTime scheduledAt;
	private String title;

	// 본인
	private Integer userId;
}
