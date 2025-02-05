package com.ssafy.igeolu.global.exception;

import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

	/**
	 * 커스텀 예외 처리
	 */
	@ExceptionHandler(CustomException.class)
	public ResponseEntity<ErrorResponse> handleCustomException(CustomException ex, HttpServletRequest request) {
		ErrorCode errorCode = ex.getErrorCode();

		return ResponseEntity.status(errorCode.getStatus())
			.body(ErrorResponse.of(errorCode, request.getRequestURI()));
	}

	/**
	 * 유효성 검증 실패 예외 (MethodArgumentNotValidException 등), Request 시 인자 검증
	 * */
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(
		MethodArgumentNotValidException ex,
		HttpServletRequest request
	) {

		// FieldError를 전부 모아서, 각각 "필드명: 에러메시지" 형태로 변환한 뒤
		// 쉼표(혹은 세미콜론 등)로 구분하여 하나의 문자열로 합칩니다.
		String errorMessage = ex.getBindingResult().getFieldErrors().stream()
			.map(fieldError -> String.format("[%s] %s",
				fieldError.getField(),
				fieldError.getDefaultMessage()))
			.collect(Collectors.joining("; "));

		// ErrorCode를 고정으로 사용
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
			.body(ErrorResponse.of(ErrorCode.INVALID_PARAMETER, errorMessage, request.getRequestURI()));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleException(Exception ex, HttpServletRequest request) {
		ex.printStackTrace();
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
			.body(ErrorResponse.of(ErrorCode.INTERNAL_SERVER_ERROR, request.getRequestURI()));
	}

}
