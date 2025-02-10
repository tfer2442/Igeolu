package com.ssafy.igeolu.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;

import lombok.NonNull;

@Profile("prod")
@Configuration
public class ElasticSearchConfig extends ElasticsearchConfiguration {
	@Override
	@NonNull
	public ClientConfiguration clientConfiguration() {
		return ClientConfiguration.builder()
			.connectedTo("elasticsearch1:9200",
				"elasticsearch2:9200",
				"elasticsearch3:9200")
			.build();
	}
}