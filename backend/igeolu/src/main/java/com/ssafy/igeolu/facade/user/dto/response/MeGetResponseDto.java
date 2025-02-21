package com.ssafy.igeolu.facade.user.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class MeGetResponseDto {
	@Schema(description = "유저 id")
	private Integer userId;

	@Schema(description = "유저 이름")
	private String userName;

	@Schema(description = "(ROLE_REALTOR, ROLE_MEMBER)")
	private String role;
}
