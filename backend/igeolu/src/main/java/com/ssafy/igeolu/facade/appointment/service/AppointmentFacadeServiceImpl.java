package com.ssafy.igeolu.facade.appointment.service;

import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.igeolu.domain.appointment.entity.Appointment;
import com.ssafy.igeolu.domain.appointment.service.AppointmentService;
import com.ssafy.igeolu.domain.chatroom.entity.ChatRoom;
import com.ssafy.igeolu.domain.chatroom.service.ChatRoomService;
import com.ssafy.igeolu.domain.notification.entity.Notification;
import com.ssafy.igeolu.domain.notification.service.NotificationService;
import com.ssafy.igeolu.domain.user.entity.Role;
import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.domain.user.service.UserService;
import com.ssafy.igeolu.facade.appointment.dto.request.AppointmentPostRequestDto;
import com.ssafy.igeolu.facade.appointment.dto.request.AppointmentPutRequestDto;
import com.ssafy.igeolu.facade.appointment.dto.response.AppointmentListGetResponseDto;
import com.ssafy.igeolu.facade.appointment.dto.response.AppointmentPostResponseDto;
import com.ssafy.igeolu.facade.notification.dto.response.AppointmentNotificationResponseDto;
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
	private final NotificationService notificationService;
	private final SimpMessagingTemplate messagingTemplate;

	@Override
	public List<AppointmentListGetResponseDto> getAppointmentList() {
		User user = userService.getUserById(securityService.getCurrentUser().getUserId());

		return appointmentService.getAppointmentList(user).stream()
			.map(a -> AppointmentListGetResponseDto.builder()
				.appointmentId(a.getId())
				.scheduledAt(a.getScheduledAt())
				.title(a.getTitle())
				.appointmentType(a.getAppointmentType())
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
			.appointmentType(request.getAppointmentType())
			.realtor(realtor)
			.member(member)
			.chatRoom(chatRoom)
			.build();

		Appointment savedAppointment = appointmentService.createAppointment(appointment);

		// 약속 생성 시 즉시 알림 전송 로직 추가
		String immediateMessageForRealtor =
			"고객 " + member.getUsername() + "님과의 약속이 생성되었습니다.";
		String immediateMessageForMember =
			"공인중개사 " + realtor.getUsername() + "님과의 약속이 생성되었습니다.";

		Notification notificationForRealtor = Notification.builder()
			.user(savedAppointment.getRealtor())
			.title(appointment.getTitle())
			.message(immediateMessageForRealtor)
			.scheduledAt(appointment.getScheduledAt())
			.build();

		Notification notificationForMember = Notification.builder()
			.user(savedAppointment.getMember())
			.title(appointment.getTitle())
			.message(immediateMessageForMember)
			.scheduledAt(appointment.getScheduledAt())
			.build();

		// 알림 등록 (데이터베이스에 저장)
		notificationService.registerNotification(notificationForRealtor);
		notificationService.registerNotification(notificationForMember);

		// 클라이언트에게 실시간 알림 전송 (WebSocket)
		AppointmentNotificationResponseDto notificationDtoForRealtor = AppointmentNotificationResponseDto.builder()
			.notificationId(notificationForRealtor.getId())
			.scheduledAt(notificationForRealtor.getScheduledAt())
			.createdAt(notificationForRealtor.getCreatedAt())
			.title(notificationForRealtor.getTitle())
			.message(notificationForRealtor.getMessage())
			.isRead(false)
			.build();

		AppointmentNotificationResponseDto notificationDtoForMember = AppointmentNotificationResponseDto.builder()
			.notificationId(notificationForMember.getId())
			.scheduledAt(notificationForMember.getScheduledAt())
			.createdAt(notificationForMember.getCreatedAt())
			.title(notificationForMember.getTitle())
			.message(notificationForMember.getMessage())
			.isRead(false)
			.build();

		messagingTemplate.convertAndSendToUser(
			savedAppointment.getRealtor().getId().toString(),
			"/notifications",
			notificationDtoForRealtor
		);

		messagingTemplate.convertAndSendToUser(
			savedAppointment.getMember().getId().toString(),
			"/notifications",
			notificationDtoForMember
		);

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
