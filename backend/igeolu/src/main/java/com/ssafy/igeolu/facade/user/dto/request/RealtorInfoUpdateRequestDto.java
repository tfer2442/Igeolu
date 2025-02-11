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

	private BigDecimal latitude;

	private BigDecimal longitude;

	private String dongcode;
}
