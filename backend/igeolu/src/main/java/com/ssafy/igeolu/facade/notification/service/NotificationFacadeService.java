package com.ssafy.igeolu.facade.notification.service;

import java.util.List;

import com.ssafy.igeolu.facade.notification.dto.response.AppointmentNotificationResponseDto;

public interface NotificationFacadeService {

	void sendAppointmentNotifications();

	List<AppointmentNotificationResponseDto> getNotifications();

	AppointmentNotificationResponseDto updateReadingStatus(Integer notificationId);

	void removeNotification(Integer notificationId);

	void updateAllReadingStatus();
}
