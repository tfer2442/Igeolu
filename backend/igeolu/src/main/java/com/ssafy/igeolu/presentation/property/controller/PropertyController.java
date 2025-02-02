package com.ssafy.igeolu.presentation.property.controller;

import org.springframework.web.bind.annotation.RestController;

import com.ssafy.igeolu.facade.property.service.PropertyFacadeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class PropertyController {
	private final PropertyFacadeService propertyFacadeService;

}
