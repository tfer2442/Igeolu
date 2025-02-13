package com.ssafy.igeolu.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ConcurrentTaskScheduler;

@Configuration
public class WebSocketSchedulerConfig {

	@Bean
	public TaskScheduler messageBrokerTaskScheduler() {
		return new ConcurrentTaskScheduler();
	}
}