package com.ssafy.igeolu.oauth;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class MyController {

	@GetMapping("/my")
	@ResponseBody
	public String myAPI() {
		System.out.println("myAPI");
		return "my route";
	}
}