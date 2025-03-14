package com.ssafy.igeolu.domain.appointment.service;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.igeolu.domain.appointment.entity.Appointment;
import com.ssafy.igeolu.domain.user.entity.User;

public interface AppointmentService {

	Appointment getAppointment(Integer appointmentId);

	List<Appointment> getAppointmentList(User user);

	Appointment createAppointment(Appointment appointment);

	void updateAppointment(Appointment appointment,
		LocalDateTime scheduledAt,
		String title);

	void deleteAppointment(Appointment appointment);
	
	List<Appointment> getAppointmentsForTenMinuteNotification(LocalDateTime start, LocalDateTime end);

	List<Appointment> getAppointmentsForThirtyMinuteNotification(LocalDateTime start, LocalDateTime end);
}
