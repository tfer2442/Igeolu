package com.ssafy.igeolu.presentation.file.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.igeolu.file.service.FileService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/files")
public class FileController {

	private final FileService fileService;

	public FileController(FileService fileService) {
		this.fileService = fileService;
	}

	@Operation(summary = "파일 저장 예제 컨트롤러", description = "파일 저장 경로를 반환합니다.")
	@PostMapping(value = "/file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
		produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> uploadFile(MultipartFile file) {
		String fileUrl = fileService.saveFile(file);
		return ResponseEntity.ok(fileUrl);
	}
}

