package com.ssafy.igeolu.facade.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class UserResponseDto {
	private Integer userId;
	private String role;
	private String profileFilePath;
	private String name;
}
