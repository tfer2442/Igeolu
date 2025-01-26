package com.ssafy.igeolu.domain.property.service;

import org.springframework.stereotype.Service;

import com.ssafy.igeolu.domain.property.repository.PropertyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PropertyDomainServiceImpl implements PropertyDomainService {
	private final PropertyRepository propertyRepository;

}
