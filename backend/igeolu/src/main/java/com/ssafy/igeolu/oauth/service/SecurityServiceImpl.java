package com.ssafy.igeolu.oauth.service;

import java.util.Collection;
import java.util.Iterator;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.ssafy.igeolu.facade.user.dto.response.MeGetResponseDto;
import com.ssafy.igeolu.oauth.dto.CustomOAuth2User;

@Service
public class SecurityServiceImpl implements SecurityService {

	@Override
	public MeGetResponseDto getCurrentUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null || authentication.getPrincipal() == null
			|| "anonymousUser".equals(authentication.getPrincipal())) {
			return null;
		}

		if (authentication.getPrincipal() instanceof CustomOAuth2User principal) {
			Collection<? extends GrantedAuthority> authorities = principal.getAuthorities();
			Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
			GrantedAuthority auth = iterator.next();
			String role = auth.getAuthority();

			return MeGetResponseDto.builder()
				.userId(principal.getUserId())
				.role(role)
				.build();
		}

		return null;
	}
}
