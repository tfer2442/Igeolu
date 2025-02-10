package com.ssafy.igeolu.global.aop;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ssafy.igeolu.domain.user.entity.Role;
import com.ssafy.igeolu.global.exception.CustomException;
import com.ssafy.igeolu.global.exception.ErrorCode;
import com.ssafy.igeolu.oauth.dto.CustomOAuth2User;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class CheckRoleAdvice {

	public static final String ADD_ADDITIONAL_INFO_URL = "/api/users/me/info";

	@ModelAttribute
	public void checkUserRole(HttpServletRequest httpServletRequest) {
		String url = httpServletRequest.getRequestURI();
		String method = httpServletRequest.getMethod();

		if (url.equals(ADD_ADDITIONAL_INFO_URL) && method.equals("POST")) {
			return;
		}

		SecurityContext context = SecurityContextHolder.getContext();
		Authentication authentication = context.getAuthentication();

		// 인증 객체가 없거나 익명 사용자일 경우 그냥 넘깁니다.
		if (authentication == null || authentication instanceof AnonymousAuthenticationToken) {
			return;
		}

		// 인증된 사용자라면 UsernamePasswordAuthenticationToken으로 캐스팅
		UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken)context.getAuthentication();
		CustomOAuth2User customOAuth2User = (CustomOAuth2User)token.getPrincipal();

		if (Role.ROLE_INCOMPLETE_REALTOR.name().equals(customOAuth2User.getRole())) {
			throw new CustomException(ErrorCode.INCOMPLETE_REALTOR);
		}
	}

}