package com.ssafy.igeolu.testcheck;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TestLoginPostRequestDto {
	@Schema(description = "테스트용 아이디", example = "coachlove12")
	private String id;

	@Schema(description = "테스트용 비밀번호", example = "consultantlove12")
	private String password;
}
