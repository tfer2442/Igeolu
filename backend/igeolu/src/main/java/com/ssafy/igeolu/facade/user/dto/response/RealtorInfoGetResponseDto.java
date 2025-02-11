package com.ssafy.igeolu.facade.user.dto.response;

import java.math.BigDecimal;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class RealtorInfoGetResponseDto {

	// User 정보
	private Integer userId;

	private String username;

	private String profileImage;

	// Realtor 정보
	private String title;
	private String content;
	private String registrationNumber;
	private String tel;
	private String address;
	private BigDecimal latitude;
	private BigDecimal longitude;
	private int liveCount;
	private String dongCode	;


}
