package com.ssafy.igeolu.global.exception;

import lombok.Getter;

/**
 * 하나의 CustomException으로 모든 예외를 처리하면서
 * 내부적으로는 ErrorCode를 사용해 분기할 수 있습니다.
 * 필요하다면 여러 개의 CustomException 클래스로 나누어도 됩니다.
 */
@Getter
public class CustomException extends RuntimeException {
	private final ErrorCode errorCode;

	/**
	 * ErrorCode의 defaultMessage를 기본 메시지로 사용
	 */
	public CustomException(ErrorCode errorCode) {
		super(errorCode.getDefaultMessage());
		this.errorCode = errorCode;
	}
}
