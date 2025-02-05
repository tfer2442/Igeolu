package com.ssafy.igeolu.facade.appointment.service;

import java.util.List;

import com.ssafy.igeolu.facade.appointment.dto.request.AppointmentListGetRequestDto;
import com.ssafy.igeolu.facade.appointment.dto.request.AppointmentPostRequestDto;
import com.ssafy.igeolu.facade.appointment.dto.request.AppointmentPutRequestDto;
import com.ssafy.igeolu.facade.appointment.dto.response.AppointmentListGetResponseDto;
import com.ssafy.igeolu.facade.appointment.dto.response.AppointmentPostResponseDto;

public interface AppointmentFacadeService {

	List<AppointmentListGetResponseDto> getAppointmentList(AppointmentListGetRequestDto request);

	AppointmentPostResponseDto createAppointment(AppointmentPostRequestDto request);

	void updateAppointment(Integer appointmentId, AppointmentPutRequestDto request);

	void deleteAppointment(Integer appointmentId);
}
