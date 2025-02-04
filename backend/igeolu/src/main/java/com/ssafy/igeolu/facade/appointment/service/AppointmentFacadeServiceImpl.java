package com.ssafy.igeolu.facade.appointment.service;

import java.util.List;

import com.ssafy.igeolu.facade.appointment.dto.request.AppointmentDeleteRequestDto;
import com.ssafy.igeolu.facade.appointment.dto.request.AppointmentPostRequestDto;
import com.ssafy.igeolu.facade.appointment.dto.request.AppointmentPutRequestDto;
import com.ssafy.igeolu.facade.appointment.dto.response.AppointmentListGetResponseDto;
import com.ssafy.igeolu.facade.appointment.dto.response.AppointmentPostResponseDto;

public class AppointmentFacadeServiceImpl implements AppointmentFacadeService {

	@Override
	public List<AppointmentListGetResponseDto> getAppointmentList(AppointmentListGetResponseDto request) {
		return List.of();
	}

	@Override
	public AppointmentPostResponseDto createAppointment(AppointmentPostRequestDto request) {
		return null;
	}

	@Override
	public AppointmentPutRequestDto updateAppointment(AppointmentPutRequestDto request) {
		return null;
	}

	@Override
	public void deleteAppointment(AppointmentDeleteRequestDto request) {

	}
}
