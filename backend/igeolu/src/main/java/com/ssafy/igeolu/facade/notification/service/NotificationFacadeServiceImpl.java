package com.ssafy.igeolu.facade.notification.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.appointment.entity.Appointment;
import com.ssafy.igeolu.domain.appointment.service.AppointmentService;
import com.ssafy.igeolu.facade.notification.dto.response.AppointmentNotificationResponseDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationFacadeServiceImpl implements NotificationFacadeService {
	private final SimpMessagingTemplate messagingTemplate;
	private final AppointmentService appointmentService;

	@Scheduled(fixedRate = 60000)
	public void sendAppointmentNotifications() {
		LocalDateTime now = LocalDateTime.now();
		// 예약 시간이 현재 시각으로부터 10분 후부터 11분 후 사이인 예약 조회
		LocalDateTime startTime = now.plusMinutes(10);
		LocalDateTime endTime = now.plusMinutes(11);

		List<Appointment> appointments = appointmentService.getAppointmentsBySchedule(startTime, endTime);

		for (Appointment appointment : appointments) {
			// 알림 메시지 구성
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd(E) HH:mm", Locale.KOREAN);
			String formattedScheduledAt = appointment.getScheduledAt().format(formatter);

			String message =
				"'" + appointment.getTitle() + "' 이(가) " + formattedScheduledAt + "에 시작됩니다. (10분 전 알림)";
			// 알림 DTO 생성
			AppointmentNotificationResponseDto notificationDto = AppointmentNotificationResponseDto.builder()
				.appointmentId(appointment.getId())
				.message(message)
				.userId(appointment.getUser().getId()) // 상대 사용자
				.opponentUserId(appointment.getOpponentUser().getId()) // 예약 생성자 (사용자)
				.build();

			// WebSocket을 통해 알림 전송
			// (클라이언트는 "/api/sub/notifications"를 구독해야 합니다)
			messagingTemplate.convertAndSend("/api/sub/notifications", notificationDto);

			// 중복 알림 전송을 방지하기 위해 알림 전송 플래그 업데이트
			appointment.setNotificationSent(true);
		}
	}
}
