package com.ssafy.igeolu.facade.user.dto.request;

import java.math.BigDecimal;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RealtorInfoUpdateRequestDto {

	private String title;

	private String content;

	private String registrationNumber;

	private String tel;

	private String address;

	// latitude
	private String y;

	// longitude
	private String x;

	private String dongcode;
}
