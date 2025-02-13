package com.ssafy.igeolu.domain.notification.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.notification.entity.Notification;
import com.ssafy.igeolu.domain.notification.repository.NotificationRepository;
import com.ssafy.igeolu.global.exception.CustomException;
import com.ssafy.igeolu.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
	private final NotificationRepository notificationRepository;

	@Override
	public void registerNotification(Notification notification) {
		notificationRepository.save(notification);
	}

	@Override
	public List<Notification> getNotificationsByUserId(Integer userId) {
		return notificationRepository.findByUser_IdOrderByCreatedAtDesc(userId);
	}

	@Override
	public Notification getNotification(Integer notificationId) {
		return notificationRepository.findById(notificationId)
			.orElseThrow(() -> new CustomException(ErrorCode.NOTIFICATION_NOT_FOUND));
	}

	@Override
	public void removeNotification(Notification notification) {
		notificationRepository.delete(notification);
	}
}
