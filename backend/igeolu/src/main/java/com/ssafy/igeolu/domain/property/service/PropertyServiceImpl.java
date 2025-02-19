package com.ssafy.igeolu.domain.property.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.property.entity.EsProperty;
import com.ssafy.igeolu.domain.property.entity.Property;
import com.ssafy.igeolu.domain.property.repository.EsPropertyRepository;
import com.ssafy.igeolu.domain.property.repository.PropertyImageRepository;
import com.ssafy.igeolu.domain.property.repository.PropertyRepository;
import com.ssafy.igeolu.domain.user.entity.User;
import com.ssafy.igeolu.global.exception.CustomException;
import com.ssafy.igeolu.global.exception.ErrorCode;

@Service
public class PropertyServiceImpl implements PropertyService {
	private final PropertyRepository propertyRepository;
	private final PropertyImageRepository propertyImageRepository;
	private final EsPropertyRepository esPropertyRepository;

	@Autowired
	public PropertyServiceImpl(PropertyRepository propertyRepository,
		PropertyImageRepository propertyImageRepository,
		@Autowired(required = false) EsPropertyRepository esPropertyRepository) {
		this.propertyRepository = propertyRepository;
		this.propertyImageRepository = propertyImageRepository;
		this.esPropertyRepository = esPropertyRepository;
	}

	@Override
	public void createProperty(Property property) {
		propertyRepository.save(property);

	}

	@Override
	public List<Property> getPropertyList(User user) {
		return propertyRepository.findByUser(user);
	}

	@Override
	public List<Property> getPropertyListIds(List<Integer> propertyIds) {
		return propertyRepository.findAllById(propertyIds);
	}

	@Override
	public Property getProperty(Integer propertyId) {
		return propertyRepository.findById(propertyId)
			.orElseThrow(() -> new CustomException(ErrorCode.PROPERTY_NOT_FOUND));
	}

	@Override
	public void updateProperty(Property property) {
		propertyRepository.save(property);
	}

	@Override
	public List<Property> getPropertiesByDongcode(String dongcode) {
		return propertyRepository.findByDongcode(dongcode);
	}

	@Override
	public void deleteProperty(Integer propertyId) {
		Property property = propertyRepository.findById(propertyId)
			.orElseThrow(() -> new CustomException(ErrorCode.PROPERTY_NOT_FOUND));
		propertyRepository.delete(property);
	}

	@Override
	public List<EsProperty> searchBy(String keyword,
		String sidoName,
		String gugunName,
		String dongName,
		Integer maxDeposit,
		Integer maxMonthlyRent,
		List<Integer> optionIds,
		Pageable pageable) {
		return esPropertyRepository.findBy(keyword,
			sidoName,
			gugunName,
			dongName,
			maxDeposit,
			maxMonthlyRent,
			optionIds,
			pageable);
	}

	public List<String> getImagesByPropertyId(Integer propertyId) {
		return propertyImageRepository.findImagesByPropertyId(propertyId);
	}
}
