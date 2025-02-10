package com.ssafy.igeolu.global.config;

import java.io.File;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

@Configuration
public class FileConfig {
	@Value("${file.upload-dir}")
	private String uploadDir;

	@PostConstruct
	public void init() {
		File directory = new File(uploadDir);
		if (!directory.exists()) {
			directory.mkdirs();
		}
	}
}