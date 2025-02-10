package com.ssafy.igeolu.global.config;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import com.ssafy.igeolu.oauth.filter.JWTFilter;
import com.ssafy.igeolu.oauth.handler.CustomLogoutHandler;
import com.ssafy.igeolu.oauth.handler.CustomSuccessHandler;
import com.ssafy.igeolu.oauth.resolver.CustomAuthorizationRequestResolver;
import com.ssafy.igeolu.oauth.service.CustomOAuth2UserService;
import com.ssafy.igeolu.oauth.util.JWTUtil;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
	private final CustomOAuth2UserService customOAuth2UserService;
	private final CustomSuccessHandler customSuccessHandler;
	private final CustomLogoutHandler customLogoutHandler;
	private final ClientRegistrationRepository clientRegistrationRepository;
	private final JWTUtil jwtUtil;

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
			.cors(corsCustomizer -> corsCustomizer.configurationSource(new CorsConfigurationSource() {

				@Override
				public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {

					CorsConfiguration configuration = new CorsConfiguration();

					configuration.setAllowedOrigins(
						Arrays.asList("http://localhost:3000", "https://i12d205.p.ssafy.io"));
					configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
					configuration.setAllowCredentials(true);
					configuration.setAllowedHeaders(Collections.singletonList("*"));
					configuration.setMaxAge(3600L);

					configuration.setExposedHeaders(Arrays.asList("Set-Cookie", "Authorization"));

					return configuration;
				}
			}));

		//경로별 인가 작업
		http
			.authorizeHttpRequests((auth) -> auth
				.requestMatchers("/api/my").authenticated()
				.requestMatchers("/api/**", "/v3/api-docs/**").permitAll() // swagger open
				.anyRequest().authenticated());

		//csrf disable
		http
			.csrf((auth) -> auth.disable());

		//Form 로그인 방식 disable
		http
			.formLogin((auth) -> auth.disable());

		//HTTP Basic 인증 방식 disable
		http
			.httpBasic((auth) -> auth.disable());

		//oauth2
		http
			.oauth2Login((oauth2) -> oauth2
				.userInfoEndpoint((userInfoEndpointConfig) -> userInfoEndpointConfig
					.userService(customOAuth2UserService))
				.authorizationEndpoint(authorizationEndpoint -> authorizationEndpoint
					// 커스텀 리졸버 등록: 클라이언트 쿼리 파라미터를 인증 요청에 포함시키기 위해
					.authorizationRequestResolver(new CustomAuthorizationRequestResolver(clientRegistrationRepository))
				)
				// 리다이렉션 엔드포인트 변경
				.redirectionEndpoint(redirection -> redirection
					.baseUri("/api/login/oauth2/code/*")
				)
				.successHandler(customSuccessHandler));

		// 로그아웃 경로 설정
		http
			.logout(logout -> logout
				.logoutUrl("/api/logout")
				.logoutSuccessHandler(customLogoutHandler));

		//세션 설정 : STATELESS
		http
			.sessionManagement((session) -> session
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		http
			.addFilterAfter(new JWTFilter(jwtUtil), OAuth2LoginAuthenticationFilter.class);

		return http.build();
	}
}