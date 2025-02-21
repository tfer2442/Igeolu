package com.ssafy.igeolu.oauth;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;

@RestController
public class MyController {

	@Operation(summary = "조회하지 마시오.", description = "로그인 테스트 용")
	@GetMapping("/api/my")
	public String myAPI() {
		System.out.println("myAPI");
		return "my route";
	}
}