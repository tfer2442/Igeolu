package com.ssafy.igeolu.presentation.notification.controller;

import org.springframework.web.bind.annotation.RestController;

import com.ssafy.igeolu.facade.notification.service.NotificationFacadeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class NotificationController {
	private final NotificationFacadeService notificationFacadeService;
}
