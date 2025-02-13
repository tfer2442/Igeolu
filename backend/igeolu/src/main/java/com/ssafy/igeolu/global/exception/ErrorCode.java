package com.ssafy.igeolu.global.exception;

import org.springframework.http.HttpStatus;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
@Schema(description = "에러 코드 Enum")
public enum ErrorCode {
	PROPERTY_NOT_FOUND(HttpStatus.NOT_FOUND, "P001", "매물을 찾을 수 없습니다."),
	DONGCODE_NOT_FOUND(HttpStatus.NOT_FOUND, "D001", "동코드를 찾을 수 없습니다."),

	UNAUTHORIZED_USER(HttpStatus.UNAUTHORIZED, "U001", "인증되지 않은 사용자입니다."),
	INCOMPLETE_REALTOR(HttpStatus.BAD_REQUEST, "U002", "정보 입력이 필요한 공인중개사입니다."),
	FORBIDDEN_USER(HttpStatus.FORBIDDEN, "U003", "권한이 없는 사용자입니다."),

	USER_NOT_FOUND(HttpStatus.NOT_FOUND, "C001", "사용자를 찾을 수 없습니다."),
	REALTOR_NOT_FOUND(HttpStatus.NOT_FOUND, "R001", "중개사를 찾을 수 없습니다."),
	
	NOTIFICATION_NOT_FOUND(HttpStatus.NOT_FOUND, "N001", "알림을 찾을 수 없습니다."),

	LIVE_SESSION_NOT_FOUND(HttpStatus.NOT_FOUND, "L001", "라이브 세션을 찾을 수 없습니다."),
	LIVE_SESSION_NOT_CREATE(HttpStatus.INTERNAL_SERVER_ERROR, "L002", "라이브 세션을 생성할 수 없습니다."),
	LIVE_PROPERTY_BAD_REQUEST(HttpStatus.BAD_REQUEST, "L003", "라이브 매물 관련 요청이 올바르지 않습니다."),
	LIVE_PROPERTY_NOT_FOUND(HttpStatus.NOT_FOUND, "L004", "라이브 매물을 찾을 수 없습니다."),
	RECORDING_NOT_FOUND(HttpStatus.NOT_FOUND, "L005", "녹화를 찾을 수 없습니다."),
	RATING_BAD_REQUEST(HttpStatus.BAD_REQUEST, "L006", "평점을 매길 수 없습니다."),

	OPENAI_INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "O001", "OpenAI 프롬프트를 로드 할 수 없습니다."),

	INVALID_PARAMETER(HttpStatus.BAD_REQUEST, "C002", "잘못된 파라미터가 전달되었습니다."),
	INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "C999", "서버 에러가 발생했습니다.");

	@Schema(description = "HTTP 상태 코드")
	private final HttpStatus status;
	@Schema(description = "커스텀 에러 코드")
	private final String code;
	@Schema(description = "기본 에러 메시지")
	private final String defaultMessage;

	ErrorCode(HttpStatus status, String code, String defaultMessage) {
		this.status = status;
		this.code = code;
		this.defaultMessage = defaultMessage;
	}
}
