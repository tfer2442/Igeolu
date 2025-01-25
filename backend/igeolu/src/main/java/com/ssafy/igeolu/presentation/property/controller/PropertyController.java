package com.ssafy.igeolu.presentation.property.controller;

import com.ssafy.igeolu.facade.property.service.PropertyFacadeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class PropertyController {
    private final PropertyFacadeService propertyFacadeService;


}
