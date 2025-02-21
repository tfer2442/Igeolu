package com.ssafy.igeolu.domain.file.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileService {

	@Value("${file.upload-dir}")
	private String uploadDir;

	@Value("${file.base-url}")
	private String baseUrl;

	public String saveFile(MultipartFile file) {
		// 디렉토리 생성
		File directory = new File(uploadDir);
		if (!directory.exists()) {
			directory.mkdirs();
		}

		// 파일명 생성 (UUID 활용)
		String originalFilename = file.getOriginalFilename();
		String extension = originalFilename != null && originalFilename.contains(".")
			? originalFilename.substring(originalFilename.lastIndexOf("."))
			: "";
		String storedFilename = UUID.randomUUID().toString() + extension;

		// 저장 경로
		Path filePath = Paths.get(uploadDir, storedFilename);
		try {
			file.transferTo(filePath.toFile());
		} catch (IOException e) {
			throw new RuntimeException("파일 저장에 문제가 발생했습니다!");
		}

		// 접근 가능한 URL 반환
		return baseUrl + "/" + storedFilename;
	}

	// 파일 삭제 기능
	public void deleteFile(String fileUrl) {

		// 파일 URL에서 마지막 부분을 추출 (파일명)
		String filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);

		// 삭제할 파일 경로 생성
		Path filePath = Paths.get(uploadDir, filename);

		// 파일 존재 여부 확인 후 삭제
		File fileToDelete = filePath.toFile();
		if (fileToDelete.exists() && fileToDelete.isFile()) {
			if (!fileToDelete.delete()) {
				// 파일 삭제 실패시 에러 반환
				throw new RuntimeException("파일 삭제에 실패했습니다!");
			}
		}
	}
}
