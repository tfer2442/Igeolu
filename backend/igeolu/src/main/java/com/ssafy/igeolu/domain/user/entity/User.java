package com.ssafy.igeolu.domain.user.entity;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	private String kakaoId;

	private String username;

	@Enumerated(EnumType.STRING) // ROLE_MEMBER, ROLE_REALTOR 로 저장
	private Role role;

	private String profileFilePath;

	@CreatedDate
	@Column(updatable = false)
	private LocalDateTime createdAt;

	@LastModifiedDate
	private LocalDateTime updatedAt;


	@Value("${file.base-rul}")
	private String baseUrl;

	public String getProfileFilePath() {
		if(profileFilePath == null || profileFilePath.isEmpty()) {
			if (this.role == Role.ROLE_MEMBER) {
				return baseUrl + "/member.jpg";
			}

			if (this.role == Role.ROLE_REALTOR){
				return baseUrl + "/realtor.jpg";
			}
		}

		return profileFilePath;
		}
	public void changeRole(Role role) {
		this.role = role;
	}

}
