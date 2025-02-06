package com.ssafy.igeolu.oauth.resolver;

import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;

import jakarta.servlet.http.HttpServletRequest;

public class CustomAuthorizationRequestResolver implements OAuth2AuthorizationRequestResolver {
	private final OAuth2AuthorizationRequestResolver defaultResolver;

	public CustomAuthorizationRequestResolver(ClientRegistrationRepository repo) {
		this.defaultResolver = new DefaultOAuth2AuthorizationRequestResolver(repo, "/api/oauth2/authorization");
	}

	@Override
	public OAuth2AuthorizationRequest resolve(HttpServletRequest request) {
		OAuth2AuthorizationRequest req = defaultResolver.resolve(request);
		return customizeAuthorizationRequest(req, request);
	}

	@Override
	public OAuth2AuthorizationRequest resolve(HttpServletRequest request, String clientRegistrationId) {
		OAuth2AuthorizationRequest req = defaultResolver.resolve(request, clientRegistrationId);
		return customizeAuthorizationRequest(req, request);
	}

	private OAuth2AuthorizationRequest customizeAuthorizationRequest(OAuth2AuthorizationRequest request,
		HttpServletRequest servletRequest) {
		if (request == null) {
			return null;
		}
		// 쿼리 파라미터에서 role 읽어오기
		String role = servletRequest.getParameter("state");

		if (role == null) {
			role = "member"; // 기본값
		}

		return OAuth2AuthorizationRequest.from(request)
			.state(role)
			.build();
	}
}