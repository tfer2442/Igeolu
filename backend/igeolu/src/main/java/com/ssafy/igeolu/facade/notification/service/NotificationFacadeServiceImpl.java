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
import com.ssafy.igeolu.domain.user.entity.User;
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

	@Scheduled(fixedRate = 60000) // 1분마다 실행
	@Override
	@Transactional
	public void sendAppointmentNotifications() {
		sendTenMinuteNotifications();
		sendThirtyMinuteNotifications();
	}

	private void sendTenMinuteNotifications() {
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime startTime10 = now.plusMinutes(9);
		LocalDateTime endTime10 = now.plusMinutes(11);
		List<Appointment> appointments10 = appointmentService.getAppointmentsForTenMinuteNotification(startTime10,
			endTime10);

		for (Appointment appointment : appointments10) {
			String messageForRealtor10 = "고객 " + appointment.getMember().getUsername() + "님과의 약속이 10분 뒤에 시작됩니다.";
			String messageForMember10 = "공인중개사 " + appointment.getRealtor().getUsername() + "님과의 약속이 10분 뒤에 시작됩니다.";

			Notification notificationForRealtor10 = Notification.builder()
				.user(appointment.getRealtor())
				.title(appointment.getTitle())
				.message(messageForRealtor10)
				.scheduledAt(appointment.getScheduledAt())
				.build();

			Notification notificationForMember10 = Notification.builder()
				.user(appointment.getMember())
				.title(appointment.getTitle())
				.message(messageForMember10)
				.scheduledAt(appointment.getScheduledAt())
				.build();

			notificationService.registerNotification(notificationForRealtor10);
			notificationService.registerNotification(notificationForMember10);

			AppointmentNotificationResponseDto notificationDtoForRealtor10 = AppointmentNotificationResponseDto.builder()
				.notificationId(notificationForRealtor10.getId())
				.scheduledAt(notificationForRealtor10.getScheduledAt())
				.createdAt(notificationForRealtor10.getCreatedAt())
				.title(notificationForRealtor10.getTitle())
				.message(messageForRealtor10)
				.isRead(false)
				.build();

			AppointmentNotificationResponseDto notificationDtoForMember10 = AppointmentNotificationResponseDto.builder()
				.notificationId(notificationForMember10.getId())
				.scheduledAt(notificationForMember10.getScheduledAt())
				.createdAt(notificationForMember10.getCreatedAt())
				.title(notificationForMember10.getTitle())
				.message(messageForMember10)
				.isRead(false)
				.build();

			messagingTemplate.convertAndSendToUser(
				appointment.getRealtor().getId().toString(),
				"/notifications",
				notificationDtoForRealtor10
			);
			messagingTemplate.convertAndSendToUser(
				appointment.getMember().getId().toString(),
				"/notifications",
				notificationDtoForMember10
			);

			appointment.setTenMinutesNotified(true);
		}
	}

	private void sendThirtyMinuteNotifications() {
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime startTime30 = now.plusMinutes(29);
		LocalDateTime endTime30 = now.plusMinutes(31);
		List<Appointment> appointments30 = appointmentService.getAppointmentsForThirtyMinuteNotification(startTime30,
			endTime30);

		for (Appointment appointment : appointments30) {
			String messageForRealtor30 = "고객 " + appointment.getMember().getUsername() + "님과의 약속이 30분 뒤에 시작됩니다.";
			String messageForMember30 = "공인중개사 " + appointment.getRealtor().getUsername() + "님과의 약속이 30분 뒤에 시작됩니다.";

			Notification notificationForRealtor30 = Notification.builder()
				.user(appointment.getRealtor())
				.title(appointment.getTitle())
				.message(messageForRealtor30)
				.scheduledAt(appointment.getScheduledAt())
				.build();

			Notification notificationForMember30 = Notification.builder()
				.user(appointment.getMember())
				.title(appointment.getTitle())
				.message(messageForMember30)
				.scheduledAt(appointment.getScheduledAt())
				.build();

			notificationService.registerNotification(notificationForRealtor30);
			notificationService.registerNotification(notificationForMember30);

			AppointmentNotificationResponseDto notificationDtoForRealtor30 = AppointmentNotificationResponseDto.builder()
				.notificationId(notificationForRealtor30.getId())
				.scheduledAt(notificationForRealtor30.getScheduledAt())
				.createdAt(notificationForRealtor30.getCreatedAt())
				.title(notificationForRealtor30.getTitle())
				.message(messageForRealtor30)
				.isRead(false)
				.build();

			AppointmentNotificationResponseDto notificationDtoForMember30 = AppointmentNotificationResponseDto.builder()
				.notificationId(notificationForMember30.getId())
				.scheduledAt(notificationForMember30.getScheduledAt())
				.createdAt(notificationForMember30.getCreatedAt())
				.title(notificationForMember30.getTitle())
				.message(messageForMember30)
				.isRead(false)
				.build();

			messagingTemplate.convertAndSendToUser(
				appointment.getRealtor().getId().toString(),
				"/notifications",
				notificationDtoForRealtor30
			);
			messagingTemplate.convertAndSendToUser(
				appointment.getMember().getId().toString(),
				"/notifications",
				notificationDtoForMember30
			);

			appointment.setThirtyMinutesNotified(true);
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
				.title(notification.getTitle())
				.scheduledAt(notification.getScheduledAt())
				.createdAt(notification.getCreatedAt())
				.message(notification.getMessage())
				.isRead(notification.getIsRead())
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
			.title(notification.getTitle())
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

	@Override
	@Transactional
	public void updateAllReadingStatus() {
		User currentUser = securityService.getUserEntity();
		notificationService.markAllNotificationsAsRead(currentUser);
	}
}
