package com.ssafy.igeolu.facade.appointment.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.igeolu.domain.appointment.entity.Appointment;
import com.ssafy.igeolu.domain.appointment.service.AppointmentService;
import com.ssafy.igeolu.domain.chatroom.entity.ChatRoom;
import com.ssafy.igeolu.domain.chatroom.service.ChatRoomService;
import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.domain.user.service.UserService;
import com.ssafy.igeolu.facade.appointment.dto.request.AppointmentListGetRequestDto;
import com.ssafy.igeolu.facade.appointment.dto.request.AppointmentPostRequestDto;
import com.ssafy.igeolu.facade.appointment.dto.request.AppointmentPutRequestDto;
import com.ssafy.igeolu.facade.appointment.dto.response.AppointmentListGetResponseDto;
import com.ssafy.igeolu.facade.appointment.dto.response.AppointmentPostResponseDto;
import com.ssafy.igeolu.global.exception.CustomException;
import com.ssafy.igeolu.global.exception.ErrorCode;
import com.ssafy.igeolu.oauth.service.SecurityService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AppointmentFacadeServiceImpl implements AppointmentFacadeService {

	private final ChatRoomService chatRoomService;
	private final AppointmentService appointmentService;
	private final UserService userService;
	private final SecurityService securityService;

	@Override
	public List<AppointmentListGetResponseDto> getAppointmentList(AppointmentListGetRequestDto request) {
		User user = userService.getUserById(securityService.getCurrentUser().getUserId());

		return appointmentService.getAppointmentList(user).stream()
			.map(a -> AppointmentListGetResponseDto.builder()
				.appointmentId(a.getId())
				.scheduledAt(a.getScheduledAt())
				.title(a.getTitle())
				.opponentName(a.getOpponentUser().getUsername())
				.build())
			.toList();
	}

	@Override
	public AppointmentPostResponseDto createAppointment(AppointmentPostRequestDto request) {

		User user = userService.getUserById(securityService.getCurrentUser().getUserId());
		User opponentUser = userService.getUserById(request.getOpponentUserId());
		ChatRoom chatRoom = chatRoomService.getChatRoom(request.getChatRoomId());

		Appointment appointment = Appointment.builder()
			.scheduledAt(request.getScheduledAt())
			.title(request.getTitle())
			.user(user)
			.opponentUser(opponentUser)
			.chatRoom(chatRoom)
			.build();

		Appointment savedAppointment = appointmentService.createAppointment(appointment);
		return AppointmentPostResponseDto.builder()
			.appointmentId(savedAppointment.getId())
			.build();

	}

	@Override
	public void updateAppointment(Integer appointmentId, AppointmentPutRequestDto request) {
		Appointment appointment = appointmentService.getAppointment(appointmentId);

		if (!appointment.getUser().getId().equals(securityService.getCurrentUser().getUserId())) {
			throw new CustomException(ErrorCode.FORBIDDEN_USER);
		}

		appointmentService.updateAppointment(appointment,
			request.getScheduledAt(),
			request.getTitle());
	}

	@Override
	public void deleteAppointment(Integer appointmentId) {
		Appointment appointment = appointmentService.getAppointment(appointmentId);

		if (!appointment.getUser().getId().equals(securityService.getCurrentUser().getUserId())) {
			throw new CustomException(ErrorCode.FORBIDDEN_USER);
		}

		appointmentService.deleteAppointment(appointment);
	}
}
