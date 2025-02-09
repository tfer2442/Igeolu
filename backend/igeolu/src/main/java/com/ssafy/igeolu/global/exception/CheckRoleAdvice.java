package com.ssafy.igeolu.global.exception;

import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ssafy.igeolu.domain.user.entity.Role;
import com.ssafy.igeolu.oauth.dto.CustomOAuth2User;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class CheckRoleAdvice {

	private static final String ADD_ADDITIONAL_INFO_URL = "/realtor/information";

	@ModelAttribute
	public void checkUserRole(HttpServletRequest httpServletRequest) {
		String url = httpServletRequest.getRequestURI();
		String method = httpServletRequest.getMethod();

		if (url.startsWith(ADD_ADDITIONAL_INFO_URL) && method.equals("POST")) {
			return;
		}

		SecurityContext context = SecurityContextHolder.getContext();
		CustomOAuth2User customOAuth2User = (CustomOAuth2User)context.getAuthentication();

		if (Role.ROLE_INCOMPLETE_REALTOR.name().equals(customOAuth2User.getRole())) {
			throw new CustomException(ErrorCode.INCOMPLETE_REALTOR);
		}
	}

}
