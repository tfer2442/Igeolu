package com.ssafy.igeolu.domain.live.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.live.entity.LiveProperty;
import com.ssafy.igeolu.domain.live.entity.LiveSession;
import com.ssafy.igeolu.domain.live.repository.LivePropertyRepository;
import com.ssafy.igeolu.domain.property.entity.Property;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LivePropertyServiceImpl implements LivePropertyService {
	private final LivePropertyRepository livePropertyRepository;

	@Override
	public void registerLiveProperties(List<Property> properties, LiveSession liveSession) {
		for (Property property : properties) {
			LiveProperty liveProperty = LiveProperty.builder()
				.property(property)
				.liveSession(liveSession)
				.build();

			livePropertyRepository.save(liveProperty);
		}
	}
}
