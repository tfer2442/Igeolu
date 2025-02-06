package com.ssafy.igeolu.oauth.handler;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.ssafy.igeolu.oauth.dto.CustomOAuth2User;
import com.ssafy.igeolu.oauth.util.JWTUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	private final JWTUtil jwtUtil;

	public CustomSuccessHandler(JWTUtil jwtUtil) {

		this.jwtUtil = jwtUtil;
	}

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
		Authentication authentication) throws IOException, ServletException {

		//OAuth2User
		CustomOAuth2User customUserDetails = (CustomOAuth2User)authentication.getPrincipal();

		Integer userId = customUserDetails.getUserId();

		Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
		Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
		GrantedAuthority auth = iterator.next();
		String role = auth.getAuthority();

		String token = jwtUtil.createJwt(userId, role, 2 * 60 * 60 * 1000L); // 2시간

		response.addCookie(createCookie("Authorization", token));
		response.sendRedirect("https://i12d205.p.ssafy.io"); // 나중에 배포 주소로 변경해야 함.
	}

	private Cookie createCookie(String key, String value) {

		Cookie cookie = new Cookie(key, value);
		cookie.setMaxAge(2 * 60 * 60); // 2시간
		cookie.setSecure(true);
		cookie.setAttribute("SameSite", "None");
		cookie.setPath("/");
		cookie.setHttpOnly(true);

		return cookie;
	}
}