package com.ssafy.igeolu.oauth.dto;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CustomOAuth2User implements OAuth2User {
	private final OAuthUserDto oAuthUserDto;

	@Override
	public Map<String, Object> getAttributes() {
		return null;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {

		Collection<GrantedAuthority> authorities = new ArrayList<>();

		authorities.add(new GrantedAuthority() {
			@Override
			public String getAuthority() {
				return oAuthUserDto.getRole();
			}
		});

		return authorities;
	}

	@Override
	public String getName() { // getKakaoId로 하고 싶지만, Override 되므로 불가능함.
		return oAuthUserDto.getKakaoId();
	}

	public Integer getUserId() {
		return oAuthUserDto.getUserId();
	}

	public String getUsername() {
		return oAuthUserDto.getUsername();
	}
}
