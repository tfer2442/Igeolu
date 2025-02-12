package com.ssafy.igeolu.domain.appointment.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.appointment.entity.Appointment;
import com.ssafy.igeolu.domain.appointment.repository.AppointmentRepository;
import com.ssafy.igeolu.domain.user.entity.Role;
import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.global.exception.CustomException;
import com.ssafy.igeolu.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

	private final AppointmentRepository appointmentRepository;

	@Override
	public Appointment getAppointment(Integer appointmentId) {
		return appointmentRepository.findById(appointmentId).orElseThrow();
	}

	@Override
	public List<Appointment> getAppointmentList(User user) {
		if (user.getRole() == Role.ROLE_REALTOR) {
			return appointmentRepository.findAllByUser(user);
		}

		if (user.getRole() == Role.ROLE_MEMBER) {
			return appointmentRepository.findAllByOpponentUser(user);
		}

		throw new CustomException(ErrorCode.FORBIDDEN_USER);
	}

	@Override
	public Appointment createAppointment(Appointment appointment) {
		return appointmentRepository.save(appointment);
	}

	@Override
	public void updateAppointment(Appointment appointment,
		LocalDateTime scheduledAt,
		String title) {

		appointment.setScheduledAt(scheduledAt);
		appointment.setTitle(title);
	}

	@Override
	public void deleteAppointment(Appointment appointment) {
		appointmentRepository.delete(appointment);
	}

	@Override
	public List<Appointment> getAppointmentsBySchedule(LocalDateTime start, LocalDateTime end) {
		return appointmentRepository.findByScheduledAtBetweenAndNotificationSentFalse(start, end);
	}
}
