package com.ssafy.igeolu.domain.rating.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.ssafy.igeolu.domain.live.entity.LiveSession;
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
public class Rating {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	// 평점 값 (예: 1 ~ 5)
	private Float score;

	// 평점을 받은 공인중개사 (라이브 세션으로부터 가져옴)
	@ManyToOne(fetch = FetchType.LAZY)
	private User realtor;

	// 평점을 남긴 고객 (액세스 토큰에서 가져온 사용자)
	@ManyToOne(fetch = FetchType.LAZY)
	private User member;

	// 해당 라이브 세션에 연결
	@ManyToOne(fetch = FetchType.LAZY)
	private LiveSession liveSession;

	@CreatedDate
	@Column(updatable = false)
	private LocalDateTime createdAt;

	@LastModifiedDate
	private LocalDateTime updatedAt;
}
