package com.ssafy.igeolu.domain.appointment.service;

import java.util.List;

import com.ssafy.igeolu.domain.appointment.entity.Appointment;
import com.ssafy.igeolu.domain.user.entity.User;

public interface AppointmentService {

	List<Appointment> getAppointmentList(User id);

	Appointment createAppointment(Appointment appointment);

	Appointment updateAppointment(Appointment appointment);

	void deleteAppointment(Appointment appointment);
}
