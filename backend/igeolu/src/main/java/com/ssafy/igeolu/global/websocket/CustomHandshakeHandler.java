package com.ssafy.igeolu.global.websocket;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

public class CustomHandshakeHandler extends DefaultHandshakeHandler {
	@Override
	protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler,
		Map<String, Object> attributes) {
		String username = (String)attributes.get(
			"userId"); // JWT에 username 없이 userId를 넣어뒀으므로 여기서, 변수를 username으로 변경해야 함.

		return new StompPrincipal(username);
	}
}
