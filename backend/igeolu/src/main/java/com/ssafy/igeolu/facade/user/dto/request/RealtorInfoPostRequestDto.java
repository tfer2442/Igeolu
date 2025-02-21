package com.ssafy.igeolu.facade.user.dto.request;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class RealtorInfoPostRequestDto {

  private String title;

  private String content;

  private String registrationNumber;

  private String tel;

  private String address;

  // latitude
  private String y;

  // longitude
  private String x;

  private String dongcode;

}
