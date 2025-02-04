package com.ssafy.igeolu.domain.property.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.property.entity.Property;
import com.ssafy.igeolu.domain.property.repository.PropertyRepository;
import com.ssafy.igeolu.domain.user.entity.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {
	private final PropertyRepository propertyRepository;

	@Override
	public void createProperty(Property property) {
		propertyRepository.save(property);

	}

	@Override
	public List<Property> getPropertyList(User user) {
		return propertyRepository.findByUser(user);
	}


}
