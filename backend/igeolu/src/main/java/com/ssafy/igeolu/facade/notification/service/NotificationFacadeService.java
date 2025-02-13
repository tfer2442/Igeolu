package com.ssafy.igeolu.facade.notification.service;

import java.util.List;

import com.ssafy.igeolu.domain.notification.entity.Notification;
import com.ssafy.igeolu.facade.notification.dto.response.AppointmentNotificationResponseDto;

public interface NotificationFacadeService {
	void sendAppointmentNotifications();

	List<AppointmentNotificationResponseDto> getNotifications();

	Notification updateReadingStatus(Integer notificationId);
}
