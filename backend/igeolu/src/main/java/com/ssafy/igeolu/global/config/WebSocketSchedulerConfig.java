package com.ssafy.igeolu.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

@Configuration
public class WebSocketSchedulerConfig {

	@Bean
	public TaskScheduler messageBrokerTaskScheduler() {
		ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
		scheduler.setPoolSize(1); // 필요에 따라 pool size를 조정하세요.
		scheduler.setThreadNamePrefix("wss-heartbeat-");
		scheduler.initialize();
		return scheduler;
	}
}