package com.ssafy.igeolu.presentation.notification.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.igeolu.facade.notification.dto.response.AppointmentNotificationResponseDto;
import com.ssafy.igeolu.facade.notification.service.NotificationFacadeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class NotificationController {
	private final NotificationFacadeService notificationFacadeService;

	@Operation(summary = "알림 목록 조회", description = "자신의 알림 목록 조회를 합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@GetMapping("/api/notifications")
	public ResponseEntity<List<AppointmentNotificationResponseDto>> getNotifications() {
		return ResponseEntity.ok(notificationFacadeService.getNotifications());
	}

	@Operation(summary = "일괄 알림 읽음 처리", description = "모든 알림을 읽음 처리합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@PatchMapping("/api/notifications")
	public ResponseEntity<Void> updateAllReadingStatus() {
		notificationFacadeService.updateAllReadingStatus();

		return ResponseEntity.ok().build();
	}

	@Operation(summary = "알림 읽음 처리", description = "알림을 읽음 처리합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@PatchMapping("/api/notifications/{notificationId}")
	public ResponseEntity<AppointmentNotificationResponseDto> updateReadingStatus(
		@PathVariable Integer notificationId) {

		return ResponseEntity.ok(notificationFacadeService.updateReadingStatus(notificationId));
	}

	@Operation(summary = "알림 삭제", description = "알림을 삭제합니다")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@DeleteMapping("/api/notifications/{notificationId}")
	public ResponseEntity<String> removeNotification(@PathVariable Integer notificationId) {
		notificationFacadeService.removeNotification(notificationId);
		return ResponseEntity.ok().build();
	}
}

