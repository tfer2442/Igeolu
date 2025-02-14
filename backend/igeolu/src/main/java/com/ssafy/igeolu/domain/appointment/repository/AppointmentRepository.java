package com.ssafy.igeolu.domain.appointment.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.igeolu.domain.appointment.entity.Appointment;
import com.ssafy.igeolu.domain.user.entity.User;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
	// 공인중개사가 약속을 조회할 때 사용
	List<Appointment> findAllByRealtor(User realtor);

	// 고객이 약속을 조회할 때 사용
	List<Appointment> findAllByMember(User member);

	// 10분 전 알림 대상 조회: 예약 시간이 start~end 사이이고 tenMinutesNotified가 false인 경우
	List<Appointment> findByScheduledAtBetweenAndTenMinutesNotifiedFalse(LocalDateTime start, LocalDateTime end);

	// 30분 전 알림 대상 조회: 예약 시간이 start~end 사이이고 thirtyMinutesNotified가 false인 경우
	List<Appointment> findByScheduledAtBetweenAndThirtyMinutesNotifiedFalse(LocalDateTime start, LocalDateTime end);
}
