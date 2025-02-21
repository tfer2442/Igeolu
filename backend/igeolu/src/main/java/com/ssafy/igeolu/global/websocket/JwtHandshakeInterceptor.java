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
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
public class JwtHandshakeInterceptor implements HandshakeInterceptor {
	private final JWTUtil jwtUtil;

	@Override
	public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
		Map<String, Object> attributes) throws Exception {

		String token = null;

		// ServerHttpRequest를 ServletServerHttpRequest로 캐스팅해서 HttpServletRequest에 접근
		if (request instanceof ServletServerHttpRequest servletRequest) {
			HttpServletRequest httpServletRequest = servletRequest.getServletRequest();

			// 1. 쿼리 파라미터에서 token 추출
			token = httpServletRequest.getParameter("token");

			// 2. 쿼리 파라미터에 토큰이 없으면 쿠키에서 Authorization 토큰 추출
			if (token == null) {
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
			System.out.println(JwtHandshakeInterceptor.class.getSimpleName() + " token is null");
			return false;
		}

		// 토큰 만료 여부 검사
		if (jwtUtil.isExpired(token)) {
			System.out.println(JwtHandshakeInterceptor.class.getSimpleName() + " token is expired");
			return false;
		}

		// 필요하다면, 토큰에서 userId 등 사용자 정보를 추출하여 attributes에 저장
		String userId = jwtUtil.getUserId(token).toString();
		attributes.put("userId", userId);

		return true;
	}

	@Override
	public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
		Exception exception) {
	}
}
