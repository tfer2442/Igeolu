package com.ssafy.igeolu.domain.live.service;

import java.util.List;

import com.ssafy.igeolu.domain.live.entity.LiveProperty;
import com.ssafy.igeolu.domain.live.entity.LiveSession;
import com.ssafy.igeolu.domain.property.entity.Property;

public interface LivePropertyService {
	void registerLiveProperties(List<Property> properties, LiveSession liveSession);

	List<LiveProperty> getLiveProperties(LiveSession liveSession);

	LiveProperty getLiveProperty(Integer livePropertyId);
}
