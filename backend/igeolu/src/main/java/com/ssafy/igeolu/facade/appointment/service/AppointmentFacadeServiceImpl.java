package com.ssafy.igeolu.facade.appointment.service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.igeolu.domain.appointment.entity.Appointment;
import com.ssafy.igeolu.domain.appointment.service.AppointmentService;
import com.ssafy.igeolu.domain.chatroom.entity.ChatRoom;
import com.ssafy.igeolu.domain.chatroom.service.ChatRoomService;
import com.ssafy.igeolu.domain.user.entity.Role;
import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.domain.user.service.UserService;
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
	public List<AppointmentListGetResponseDto> getAppointmentList() {
		User user = userService.getUserById(securityService.getCurrentUser().getUserId());
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd(E) HH:mm", Locale.KOREAN);

		return appointmentService.getAppointmentList(user).stream()
			.map(a -> AppointmentListGetResponseDto.builder()
				.appointmentId(a.getId())
				.scheduledAt(a.getScheduledAt().format(formatter))
				.title(a.getTitle())
				.realtorId(a.getRealtor().getId())
				.realtorName(a.getRealtor().getUsername())
				.memberId(a.getMember().getId())
				.memberName(a.getMember().getUsername())
				.build())
			.toList();
	}

	@Override
	public AppointmentPostResponseDto createAppointment(AppointmentPostRequestDto request) {

		User realtor = userService.getUserById(securityService.getCurrentUser().getUserId());

		if (realtor.getRole() != Role.ROLE_REALTOR) {
			throw new CustomException(ErrorCode.FORBIDDEN_USER);
		}

		User member = userService.getUserById(request.getMemberId());
		ChatRoom chatRoom = chatRoomService.getChatRoom(request.getChatRoomId());

		Appointment appointment = Appointment.builder()
			.scheduledAt(request.getScheduledAt())
			.title(request.getTitle())
			.realtor(realtor)
			.member(member)
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

		if (!appointment.getRealtor().getId().equals(securityService.getCurrentUser().getUserId())) {
			throw new CustomException(ErrorCode.FORBIDDEN_USER);
		}

		appointmentService.updateAppointment(appointment,
			request.getScheduledAt(),
			request.getTitle());
	}

	@Override
	public void deleteAppointment(Integer appointmentId) {
		Appointment appointment = appointmentService.getAppointment(appointmentId);

		if (!appointment.getRealtor().getId().equals(securityService.getCurrentUser().getUserId())) {
			throw new CustomException(ErrorCode.FORBIDDEN_USER);
		}

		appointmentService.deleteAppointment(appointment);
	}
}
