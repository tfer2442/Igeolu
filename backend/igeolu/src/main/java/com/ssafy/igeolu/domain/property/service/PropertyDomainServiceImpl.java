package com.ssafy.igeolu.domain.property.service;

import com.ssafy.igeolu.domain.property.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PropertyDomainServiceImpl implements PropertyDomainService {
    private final PropertyRepository propertyRepository;


}
