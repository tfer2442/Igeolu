package com.ssafy.igeolu.domain.appointment.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.igeolu.domain.appointment.entity.Appointment;
import com.ssafy.igeolu.domain.user.entity.User;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

	// // user 또는 opponentUser와 일치하는 Appointment 조회
	// @Query("SELECT a FROM Appointment a WHERE a.user = :user OR a.opponentUser = :user")
	// List<Appointment> findByUserOrOpponentUser(@Param("user") User user);

	// 공인중개사가 약속을 조회할 때 사용
	List<Appointment> findAllByRealtor(User realtor);

	// 고객이 약속을 조회할 때 사용
	List<Appointment> findAllByMember(User member);

	// 예약 시간이 지정한 범위 내이고, 아직 알림이 전송되지 않은 예약을 조회
	List<Appointment> findByScheduledAtBetweenAndNotificationSentFalse(LocalDateTime start, LocalDateTime end);
}
