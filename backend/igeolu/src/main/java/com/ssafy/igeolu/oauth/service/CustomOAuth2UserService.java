package com.ssafy.igeolu.oauth.service;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.oauth.dto.CustomOAuth2User;
import com.ssafy.igeolu.oauth.dto.KakaoResponse;
import com.ssafy.igeolu.oauth.dto.OAuth2Response;
import com.ssafy.igeolu.oauth.dto.OAuthUserDto;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
	private final SecurityService securityService;

	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		OAuth2User oAuth2User = super.loadUser(userRequest);
		String registrationId = userRequest.getClientRegistration().getRegistrationId();

		OAuth2Response oAuth2Response = null;
		if (registrationId.equals("kakao")) {
			oAuth2Response = new KakaoResponse(oAuth2User.getAttributes());
		} else {
			return null;
		}

		String kakaoId = oAuth2Response.getProvider() + " " + oAuth2Response.getProviderId();
		String nickName = oAuth2Response.getName();
		HttpServletRequest request = ((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest();
		String state = request.getParameter("state"); // member or realtor

		// state 파라미터 검증
		if (!"member".equals(state) && !"realtor".equals(state)) {
			throw new IllegalArgumentException("Invalid state parameter");
		}

		User user = securityService.processOAuth2User(kakaoId, nickName, state);

		OAuthUserDto oAuthUserDto = OAuthUserDto.builder()
			.userId(user.getId())
			.kakaoId(user.getKakaoId())
			.username(user.getUsername())
			.role(user.getRole().name())
			.build();

		return new CustomOAuth2User(oAuthUserDto);
	}
}
