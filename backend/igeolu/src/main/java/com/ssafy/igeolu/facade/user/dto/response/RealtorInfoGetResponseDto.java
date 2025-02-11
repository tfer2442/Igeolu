package com.ssafy.igeolu.facade.user.dto.response;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
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
	private String dongCode;

	// 평점 평균
	@Schema(description = "평점 평균 (소수 점 첫째 자리까지)")
	private Double ratingAvg;
}
