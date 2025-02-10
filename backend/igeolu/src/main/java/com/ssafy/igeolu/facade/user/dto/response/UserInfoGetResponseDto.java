package com.ssafy.igeolu.facade.user.dto.response;

import com.ssafy.igeolu.domain.user.entity.Role;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class UserInfoGetResponseDto {

	private Integer userId;

	private String username;

	private Role role;

	private String imageUrl;


}
