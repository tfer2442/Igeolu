package com.ssafy.igeolu.oauth.filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ssafy.igeolu.oauth.dto.CustomOAuth2User;
import com.ssafy.igeolu.oauth.dto.OAuthUserDto;
import com.ssafy.igeolu.oauth.util.JWTUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@SuppressWarnings("checkstyle:AbbreviationAsWordInName")
@RequiredArgsConstructor
public class JWTFilter extends OncePerRequestFilter {

	private final JWTUtil jwtUtil;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
		FilterChain filterChain) throws ServletException, IOException {

		// cookie들을 불러온 뒤 Authorization Key에 담긴 쿠키를 찾음
		String authorization = request.getHeader("Authorization");
		String token = null;

		if (authorization != null) {
			if (!authorization.startsWith("Bearer ")) {
				filterChain.doFilter(request, response);
				return;
			}
			token = authorization.split(" ")[1];
		} else {
			Cookie[] cookies = request.getCookies();
			if (cookies != null) {
				for (Cookie cookie : cookies) {
					String cookieName = cookie.getName();

					if (cookieName.equals("Authorization")) {
						token = cookie.getValue();
						break;
					}
				}
			}
		}

		if (token == null) {

			System.out.println("token null");
			filterChain.doFilter(request, response);

			return;
		}

		// 토큰 소멸 시간 검증
		if (jwtUtil.isExpired(token)) {

			System.out.println("token expired");
			filterChain.doFilter(request, response);

			// 조건이 해당되면 메소드 종료 (필수)
			return;
		}

		//토큰에서 userId와 role 획득
		Integer userId = jwtUtil.getUserId(token);
		String role = jwtUtil.getRole(token);

		// userDTO를 생성하여 값 set
		OAuthUserDto oAuthUserDto = OAuthUserDto.builder()
			.userId(userId)
			.role(role)
			.build();

		// UserDetails에 회원 정보 객체 담기
		CustomOAuth2User customOAuth2User = new CustomOAuth2User(oAuthUserDto);

		// 스프링 시큐리티 인증 토큰 생성
		Authentication authToken = new UsernamePasswordAuthenticationToken(customOAuth2User, null,
			customOAuth2User.getAuthorities());

		// 세션에 사용자 등록
		SecurityContextHolder.getContext().setAuthentication(authToken);

		filterChain.doFilter(request, response);
	}
}
