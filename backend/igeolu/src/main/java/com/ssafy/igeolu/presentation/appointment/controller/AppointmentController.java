package com.ssafy.igeolu.presentation.appointment.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.igeolu.facade.appointment.dto.request.AppointmentPostRequestDto;
import com.ssafy.igeolu.facade.appointment.dto.request.AppointmentPutRequestDto;
import com.ssafy.igeolu.facade.appointment.dto.response.AppointmentListGetResponseDto;
import com.ssafy.igeolu.facade.appointment.dto.response.AppointmentPostResponseDto;
import com.ssafy.igeolu.facade.appointment.service.AppointmentFacadeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/appointments")
public class AppointmentController {

	private final AppointmentFacadeService appointmentFacadeService;

	@Operation(summary = "약속 리스트 조회", description = "사용자의 약속 리스트를 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리")
	})
	@GetMapping("")
	public ResponseEntity<List<AppointmentListGetResponseDto>> getAppointmentList() {
		List<AppointmentListGetResponseDto> responses = appointmentFacadeService.getAppointmentList();
		return ResponseEntity.ok().body(responses);
	}

	@Operation(summary = "약속 생성", description = "새로운 약속을 생성합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리")
	})
	@PostMapping("")
	public ResponseEntity<AppointmentPostResponseDto> createAppointment(
		@RequestBody @Valid AppointmentPostRequestDto request) {
		AppointmentPostResponseDto response = appointmentFacadeService.createAppointment(request);
		return ResponseEntity.ok().body(response);
	}

	@Operation(summary = "약속 수정", description = "기존 약속을 수정합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "204", description = "정상 처리"),
		@ApiResponse(responseCode = "404", description = "해당 ID의 약속이 존재하지 않음")
	})
	@PutMapping("/{appointmentId}")
	public ResponseEntity<Void> updateAppointment(
		@PathVariable("appointmentId") Integer appointmentId,
		@RequestBody @Valid AppointmentPutRequestDto request) {
		appointmentFacadeService.updateAppointment(appointmentId, request);
		return ResponseEntity.noContent().build();
	}

	@Operation(summary = "약속 삭제", description = "기존 약속을 삭제합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "204", description = "정상 처리"),
		@ApiResponse(responseCode = "404", description = "해당 ID의 약속이 존재하지 않음")
	})
	@DeleteMapping("/{appointmentId}")
	public ResponseEntity<Void> deleteAppointment(@PathVariable("appointmentId") Integer id) {
		appointmentFacadeService.deleteAppointment(id);
		return ResponseEntity.noContent().build();
	}
}
