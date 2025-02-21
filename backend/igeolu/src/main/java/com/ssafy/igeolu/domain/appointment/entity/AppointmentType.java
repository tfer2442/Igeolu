package com.ssafy.igeolu.domain.appointment.entity;

import lombok.Getter;

@Getter
public enum AppointmentType {
	LIVE("라이브"),
	COMMON("일반");

	private final String label;

	AppointmentType(String label) {
		this.label = label;
	}
}
