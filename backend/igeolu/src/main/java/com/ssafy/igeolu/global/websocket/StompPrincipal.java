package com.ssafy.igeolu.global.websocket;

import java.security.Principal;

import lombok.Getter;

@Getter
public class StompPrincipal implements Principal {

	private final String name;

	public StompPrincipal(String name) {
		this.name = name;
	}

	@Override
	public String getName() {
		return name;
	}
}