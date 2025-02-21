package com.ssafy.igeolu.oauth.handler;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomLogoutHandler implements LogoutSuccessHandler {

	@Override
	public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response,
		Authentication authentication) throws IOException, ServletException {

		// 1. Authorization 쿠키 삭제 (쿠키 이름이 "Authorization"이라고 가정)
		Cookie cookie = new Cookie("Authorization", null);
		cookie.setPath("/");  // 쿠키의 경로 설정
		cookie.setMaxAge(0);  // 쿠키 만료 시간 0 설정 (삭제)
		response.addCookie(cookie);
	}
}
