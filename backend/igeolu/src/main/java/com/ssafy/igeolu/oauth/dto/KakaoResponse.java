package com.ssafy.igeolu.oauth.dto;

import java.util.Map;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class KakaoResponse implements OAuth2Response {
	private final Map<String, Object> attributes;

	@Override
	public String getProvider() {
		// 카카오 공급자이므로
		return "kakao";
	}

	@Override
	public String getProviderId() {
		// 만약 attributes에 "id" 값이 있다면 사용, 없으면 다른 고유값(email 등)을 사용할 수 있습니다.
		Object id = attributes.get("id");

		return id != null ? id.toString() : null;
	}

	@Override
	public String getName() {
		// attributes에 저장했던 nickname 값을 사용

		Map<String, Object> properties = (Map<String, Object>)attributes.get("properties");
		if (properties != null) {
			Object nicknameObj = properties.get("nickname");
			if (nicknameObj != null) {
				return nicknameObj.toString();
			}
		}
		return null;
	}
}
