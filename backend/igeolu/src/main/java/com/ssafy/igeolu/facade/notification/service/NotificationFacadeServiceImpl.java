package com.ssafy.igeolu.facade.notification.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.igeolu.domain.appointment.entity.Appointment;
import com.ssafy.igeolu.domain.appointment.service.AppointmentService;
import com.ssafy.igeolu.domain.notification.entity.Notification;
import com.ssafy.igeolu.domain.notification.service.NotificationService;
import com.ssafy.igeolu.facade.notification.dto.response.AppointmentNotificationResponseDto;
import com.ssafy.igeolu.oauth.service.SecurityService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationFacadeServiceImpl implements NotificationFacadeService {
	private final SimpMessagingTemplate messagingTemplate;
	private final AppointmentService appointmentService;
	private final NotificationService notificationService;
	private final SecurityService securityService;

	@Scheduled(fixedRate = 60000) // 1분
	@Override
	@Transactional
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

			// WebSocket을 통해 알림 전송 (사용자별 전송)
			// 첫번째 인자로 대상 사용자의 username을 전달합니다.
			// 최종적으로 클라이언트는 "/api/sub-user/{username}/notifications"로 메시지를 수신하게 됩니다.
			messagingTemplate.convertAndSendToUser(
				appointment.getRealtor().getId().toString(), // 대상 사용자의 username
				"/notifications",                        // destination, 최종 경로는 "/api/sub-user/{username}/notifications"
				notificationDtoForRealtor
			);

			messagingTemplate.convertAndSendToUser(
				appointment.getMember().getId().toString(),
				"/notifications",
				notificationDtoForMember
			);

			// 중복 알림 전송을 방지하기 위해 알림 전송 플래그 업데이트
			appointment.setNotificationSent(true);
		}
	}

	@Override
	@Transactional(readOnly = true)
	public List<AppointmentNotificationResponseDto> getNotifications() {
		Integer userId = securityService.getCurrentUser().getUserId();

		List<Notification> notifications = notificationService.getNotificationsByUserId(userId);

		return notifications.stream()
			.map(notification -> AppointmentNotificationResponseDto.builder()
				.notificationId(notification.getId())
				.scheduledAt(notification.getScheduledAt())
				.createdAt(notification.getCreatedAt())
				.message(notification.getMessage())
				.build())
			.toList();
	}

	@Override
	@Transactional
	public AppointmentNotificationResponseDto updateReadingStatus(Integer notificationId) {
		Notification notification = notificationService.getNotification(notificationId);
		notification.setIsRead(true);

		return AppointmentNotificationResponseDto.builder()
			.notificationId(notification.getId())
			.scheduledAt(notification.getScheduledAt())
			.createdAt(notification.getCreatedAt())
			.message(notification.getMessage())
			.build();
	}

	@Override
	@Transactional
	public void removeNotification(Integer notificationId) {
		Notification notification = notificationService.getNotification(notificationId);
		notificationService.removeNotification(notification);
	}
}
