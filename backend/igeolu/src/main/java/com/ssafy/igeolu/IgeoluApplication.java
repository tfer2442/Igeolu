package com.ssafy.igeolu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class IgeoluApplication {

	public static void main(String[] args) {
		SpringApplication.run(IgeoluApplication.class, args);
	}

}
