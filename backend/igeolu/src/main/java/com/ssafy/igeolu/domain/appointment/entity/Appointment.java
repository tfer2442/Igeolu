package com.ssafy.igeolu.domain.appointment.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.ssafy.igeolu.domain.chatroom.entity.ChatRoom;
import com.ssafy.igeolu.domain.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Getter
@Setter
public class Appointment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	// 예약일
	private LocalDateTime scheduledAt;

	// 예약 정보
	private String title;

	//공인중개사
	@ManyToOne(fetch = FetchType.LAZY)
	private User realtor;

	// 고객
	@ManyToOne(fetch = FetchType.LAZY)
	private User member;

	@ManyToOne(fetch = FetchType.LAZY)
	private ChatRoom chatRoom;

	@CreatedDate
	@Column(updatable = false)
	private LocalDateTime createdAt;

	@LastModifiedDate
	private LocalDateTime updatedAt;

	// 10분 전 중복 알림 전송을 방지하기 위한 필드
	@Builder.Default
	private Boolean tenMinutesNotified = false;

	// 10분 전 중복 알림 전송을 방지하기 위한 필드
	@Builder.Default
	private Boolean thirtyMinutesNotified = false;
}
