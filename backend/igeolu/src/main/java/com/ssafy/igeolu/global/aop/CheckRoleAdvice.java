package com.ssafy.igeolu.global.aop;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
		UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken)context.getAuthentication();
		CustomOAuth2User customOAuth2User = (CustomOAuth2User)token.getPrincipal();

		if (Role.ROLE_INCOMPLETE_REALTOR.name().equals(customOAuth2User.getRole())) {
			throw new CustomException(ErrorCode.INCOMPLETE_REALTOR);
		}
	}

}