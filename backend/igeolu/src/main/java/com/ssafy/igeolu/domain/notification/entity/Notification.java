package com.ssafy.igeolu.domain.notification.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

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
public class Notification {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	// 스케줄 시간
	private LocalDateTime scheduledAt;

	// 약속 제목
	private String title;

	// 알림 내용
	private String message;

	// 읽음 여부
	@Builder.Default
	private Boolean isRead = false;

	// 알림 대상자
	@ManyToOne(fetch = FetchType.LAZY)
	private User user;

	@CreatedDate
	@Column(updatable = false)
	// 알림 발생 시각
	private LocalDateTime createdAt;
}
