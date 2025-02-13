// package com.ssafy.igeolu.domain.notification.entity;
//
// import org.springframework.data.jpa.domain.support.AuditingEntityListener;
//
// import com.ssafy.igeolu.domain.user.entity.User;
//
// import jakarta.persistence.Entity;
// import jakarta.persistence.EntityListeners;
// import jakarta.persistence.FetchType;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.ManyToOne;
// import lombok.AccessLevel;
// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Getter;
// import lombok.NoArgsConstructor;
// import lombok.Setter;
//
// @Entity
// @EntityListeners(AuditingEntityListener.class)
// @AllArgsConstructor
// @NoArgsConstructor(access = AccessLevel.PROTECTED)
// @Builder
// @Getter
// @Setter
// public class Notification {
// 	@Id
// 	@GeneratedValue(strategy = GenerationType.IDENTITY)
// 	private Integer id;
//
// 	private String scheduledAt;
//
// 	// 알림 대상자
// 	@ManyToOne(fetch = FetchType.LAZY)
// 	private User user;
//
// 	//
// 	@ManyToOne(fetch = FetchType.LAZY)
// 	private User opponentUser;
// }
