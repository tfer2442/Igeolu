package com.ssafy.igeolu.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.ssafy.igeolu.infra.naver.ClovaSpeechClient;

@Configuration
public class ClovaSpeechConfig {

	@Value("${clova.api.secret}")
	private String secret;

	@Value("${clova.api.invokeUrl}")
	private String invokeUrl;

	@Bean
	public ClovaSpeechClient clovaSpeechClient() {
		return new ClovaSpeechClient(secret, invokeUrl);
	}
}