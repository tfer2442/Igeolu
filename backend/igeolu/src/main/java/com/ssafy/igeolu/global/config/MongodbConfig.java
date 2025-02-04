package com.ssafy.igeolu.global.config;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.mongodb.config.EnableReactiveMongoAuditing;
import org.springframework.data.mongodb.core.convert.DefaultMongoTypeMapper;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableReactiveMongoAuditing
@RequiredArgsConstructor
public class MongodbConfig implements InitializingBean {

	@Lazy
	private final MappingMongoConverter mappingMongoConverter;

	@Override
	public void afterPropertiesSet() {
		// 데이터 저장시 패키지정보를 자동생성하여 저장하는것을 방지를 위한 설정
		mappingMongoConverter.setTypeMapper(new DefaultMongoTypeMapper(null));
	}
}