package com.ssafy.igeolu.facade.notification.service;

import java.time.LocalDateTime;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.appointment.service.AppointmentService;

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

	}

}
