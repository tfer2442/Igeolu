package com.ssafy.igeolu.facade.notification.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.appointment.entity.Appointment;
import com.ssafy.igeolu.domain.appointment.service.AppointmentService;
import com.ssafy.igeolu.domain.notification.entity.Notification;
import com.ssafy.igeolu.domain.notification.service.NotificationService;
import com.ssafy.igeolu.facade.notification.dto.response.AppointmentNotificationResponseDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationFacadeServiceImpl implements NotificationFacadeService {
	private final SimpMessagingTemplate messagingTemplate;
	private final AppointmentService appointmentService;
	private final NotificationService notificationService;

	@Scheduled(fixedRate = 60000) // 1분 마다 실행
	public void sendAppointmentNotifications() {
		LocalDateTime now = LocalDateTime.now();
		// 예약 시간이 현재 시각으로부터 10분 후부터 11분 후 사이인 예약 조회
		LocalDateTime startTime = now.plusMinutes(10);
		LocalDateTime endTime = now.plusMinutes(11);

		List<Appointment> appointments = appointmentService.getAppointmentsBySchedule(startTime, endTime);

		for (Appointment appointment : appointments) {

			// 각 사용자별 메시지 생성
			String messageForRealtor = "'" + appointment.getTitle() + "' 일정: 고객 "
				+ appointment.getMember().getUsername() + "님과의 약속이 10분 뒤에 시작됩니다.";
			String messageForMember = "'" + appointment.getTitle() + "' 일정: 공인중개사 "
				+ appointment.getRealtor().getUsername() + "님과의 약속이 10분 뒤에 시작됩니다.";

			// 알림 객체 생성
			Notification notificationForRealtor = Notification.builder()
				.user(appointment.getRealtor())
				.message(messageForRealtor)
				.scheduledAt(appointment.getScheduledAt())
				.build();

			Notification notificationForMember = Notification.builder()
				.user(appointment.getMember())
				.message(messageForMember)
				.scheduledAt(appointment.getScheduledAt())
				.build();

			notificationService.registerNotification(notificationForRealtor);
			notificationService.registerNotification(notificationForMember);

			// 공인중개사 알림 DTO 생성
			AppointmentNotificationResponseDto notificationDtoForRealtor = AppointmentNotificationResponseDto.builder()
				.notificationId(notificationForRealtor.getId())
				.scheduledAt(notificationForRealtor.getScheduledAt())
				.createdAt(notificationForRealtor.getCreatedAt())
				.message(messageForRealtor)
				.build();

			// 고객 알림 DTO 생성
			AppointmentNotificationResponseDto notificationDtoForMember = AppointmentNotificationResponseDto.builder()
				.notificationId(notificationForMember.getId())
				.scheduledAt(notificationForMember.getScheduledAt())
				.createdAt(notificationForMember.getCreatedAt())
				.message(messageForMember)
				.build();

			// WebSocket을 통해 알림 전송
			// (클라이언트는 "/api/sub/notifications/{userId}"를 구독해야 합니다)
			messagingTemplate.convertAndSend("/api/sub/notifications/" + appointment.getRealtor().getId(),
				notificationDtoForRealtor);
			messagingTemplate.convertAndSend("/api/sub/notifications/" + appointment.getMember().getId(),
				notificationDtoForMember);

			// 중복 알림 전송을 방지하기 위해 알림 전송 플래그 업데이트
			appointment.setNotificationSent(true);
		}
	}
}
