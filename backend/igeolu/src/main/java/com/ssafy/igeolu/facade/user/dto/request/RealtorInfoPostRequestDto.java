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

  private BigDecimal latitude;

  private BigDecimal longitude;

  private String dongcode;

}
