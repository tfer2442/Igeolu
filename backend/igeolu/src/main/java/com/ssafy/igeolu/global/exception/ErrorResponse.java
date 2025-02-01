package com.ssafy.igeolu.global.exception;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "공통 에러 응답 객체")
public class ErrorResponse {
	@Schema(description = "커스텀 에러 코드 (예: C001)")
	private String code;

	@Schema(description = "에러 상세 메시지")
	private String message;

	@Schema(description = "요청 경로(URI)")
	private String path;

	public static ErrorResponse of(ErrorCode errorCode, String message, String path) {
		return ErrorResponse.builder()
			.code(errorCode.getCode())
			.message(message)
			.path(path)
			.build();
	}

	public static ErrorResponse of(ErrorCode errorCode, String path) {
		return ErrorResponse.builder()
			.code(errorCode.getCode())
			.message(errorCode.getDefaultMessage())
			.path(path)
			.build();
	}
}
