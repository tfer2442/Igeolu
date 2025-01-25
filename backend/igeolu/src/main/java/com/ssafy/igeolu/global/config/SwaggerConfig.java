package com.ssafy.igeolu.global.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
        info = @Info(title = "이걸루 명세서",
                description = "이걸루 백엔드 API",
                version = "1.0"),
        servers = {
                @Server(url = "http://localhost:8080", description = "개발 서버"),
        }
)
@Configuration
public class SwaggerConfig {

}
