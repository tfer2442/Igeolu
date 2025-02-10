package com.ssafy.igeolu.oauth.service;

import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.oauth.dto.MyInfoDto;

public interface SecurityService {
	MyInfoDto getCurrentUser();

	User processOAuth2User(String kakaoId, String nickName, String state);

	User getUserEntity();
}
