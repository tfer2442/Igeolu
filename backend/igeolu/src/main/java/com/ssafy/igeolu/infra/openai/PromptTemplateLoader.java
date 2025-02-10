// package com.ssafy.igeolu.infra.openai;
//
// import java.io.IOException;
// import java.nio.charset.StandardCharsets;
//
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.core.io.Resource;
// import org.springframework.stereotype.Component;
// import org.springframework.util.FileCopyUtils;
//
// import com.ssafy.igeolu.global.exception.CustomException;
// import com.ssafy.igeolu.global.exception.ErrorCode;
//
// @Component
// public class PromptTemplateLoader {
// 	@Value("classpath:prompts/prompt-summary-system.st")
// 	private Resource systemPromptResource;
//
// 	@Value("classpath:prompts/prompt-summary-user.st")
// 	private Resource userPromptResource;
//
// 	public String loadSystemPrompt() {
// 		try {
// 			return new String(FileCopyUtils.copyToByteArray(systemPromptResource.getInputStream()),
// 				StandardCharsets.UTF_8);
// 		} catch (IOException e) {
// 			throw new CustomException(ErrorCode.OPENAI_INTERNAL_SERVER_ERROR);
// 		}
// 	}
//
// 	public String loadUserPrompt() {
// 		try {
// 			return new String(FileCopyUtils.copyToByteArray(userPromptResource.getInputStream()),
// 				StandardCharsets.UTF_8);
// 		} catch (IOException e) {
// 			throw new CustomException(ErrorCode.OPENAI_INTERNAL_SERVER_ERROR);
// 		}
// 	}
//
// }
