package com.ssafy.igeolu.global.websocket;

import java.util.Map;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import com.ssafy.igeolu.oauth.util.JWTUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JwtHandshakeInterceptor implements HandshakeInterceptor {
	private final JWTUtil jwtUtil;

	@Override
	public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
		Map<String, Object> attributes) throws Exception {

		String token = null;

		// ServerHttpRequest를 ServletServerHttpRequest로 캐스팅해서 HttpServletRequest에 접근
		if (request instanceof ServletServerHttpRequest servletRequest) {
			HttpServletRequest httpServletRequest = servletRequest.getServletRequest();

			// 1. 헤더에서 Authorization 토큰 추출
			String authorization = httpServletRequest.getHeader("Authorization");
			if (authorization != null && authorization.startsWith("Bearer ")) {
				token = authorization.substring(7); // "Bearer " 이후의 토큰 부분 추출
			} else {
				// 2. 쿠키에서 Authorization 토큰 추출
				Cookie[] cookies = httpServletRequest.getCookies();
				if (cookies != null) {
					for (Cookie cookie : cookies) {
						if ("Authorization".equals(cookie.getName())) {
							token = cookie.getValue();
							break;
						}
					}
				}
			}
		}

		if (token == null) {
			System.out.println("token null");
			return false;
		}

		// 토큰 만료 여부 검사
		if (jwtUtil.isExpired(token)) {
			System.out.println("token expired");
			return false;
		}

		// 필요하다면, 토큰에서 username 등 사용자 정보를 추출하여 attributes에 저장
		Integer userId = jwtUtil.getUserId(token);
		attributes.put("userId", userId);

		return true;
	}

	@Override
	public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
		Exception exception) {
	}
}
