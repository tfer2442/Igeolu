package com.ssafy.igeolu.domain.notification.service;

import java.util.List;

import com.ssafy.igeolu.domain.notification.entity.Notification;

public interface NotificationService {
	void registerNotification(Notification notification);

	List<Notification> getNotificationsByUserId(Integer userId);

	Notification getNotification(Integer notificationId);

	void removeNotification(Notification notification);
}
