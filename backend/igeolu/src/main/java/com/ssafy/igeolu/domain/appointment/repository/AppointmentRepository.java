package com.ssafy.igeolu.domain.appointment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.igeolu.domain.appointment.entity.Appointment;
import com.ssafy.igeolu.domain.user.entity.User;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

	// user 또는 opponentUser와 일치하는 Appointment 조회
	@Query("SELECT a FROM Appointment a WHERE a.user = :user OR a.opponentUser = :user")
	List<Appointment> findByUserOrOpponentUser(@Param("user") User user);
}
