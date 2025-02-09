package com.ssafy.igeolu.domain.user.entity;

import lombok.Getter;

@Getter
public enum Role {
	ROLE_MEMBER("일반"),
	ROLE_REALTOR("공인중개사"),
	ROLE_INCOMPLETE_REALTOR("추가정보 미기입 공인중개사");

	private final String label;

	Role(String label) {
		this.label = label;
	}
}
