package com.ssafy.igeolu.domain.appointment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.igeolu.domain.appointment.entity.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
}
