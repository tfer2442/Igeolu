package com.ssafy.igeolu.facade.appointment.service;

import java.util.List;

import com.ssafy.igeolu.facade.appointment.dto.request.AppointmentDeleteRequestDto;
import com.ssafy.igeolu.facade.appointment.dto.request.AppointmentPostRequestDto;
import com.ssafy.igeolu.facade.appointment.dto.request.AppointmentPutRequestDto;
import com.ssafy.igeolu.facade.appointment.dto.response.AppointmentListGetResponseDto;
import com.ssafy.igeolu.facade.appointment.dto.response.AppointmentPostResponseDto;

public interface AppointmentFacadeService {

	List<AppointmentListGetResponseDto> getAppointmentList(AppointmentListGetResponseDto request);

	AppointmentPostResponseDto createAppointment(AppointmentPostRequestDto request);

	AppointmentPutRequestDto updateAppointment(AppointmentPutRequestDto request);

	void deleteAppointment(AppointmentDeleteRequestDto request);
}
