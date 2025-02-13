package com.ssafy.igeolu.presentation.notification.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
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

	@Operation(summary = "알림 목록 조회", description = "자신의 알림 목록 조회를 합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@PatchMapping("/api/notifications/{notificationId}")
	public ResponseEntity<?> getNotifications(
		@PathVariable Integer notificationId) {
		// notificationFacadeService.update
		// return ResponseEntity.ok(notificationFacadeService.getNotifications());
	}
}

