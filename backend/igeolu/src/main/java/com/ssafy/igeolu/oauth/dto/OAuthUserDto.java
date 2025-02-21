package com.ssafy.igeolu.oauth.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class OAuthUserDto {
	private Integer userId;
	private String role;
	private String kakaoId;
	private String username;
}
