package com.ssafy.igeolu.domain.user.entity;

import java.math.BigDecimal;

import com.ssafy.igeolu.domain.dongcodes.entity.Dongcodes;
import com.ssafy.igeolu.global.util.CoordinateConverter;

import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Getter
@Setter
public class Realtor {


  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  private String title;

  private String content;

  private String registrationNumber;

  private String tel;

  private String address;

  @Column(precision = 20, scale = 17)
  private BigDecimal latitude;

  @Column(precision = 20, scale = 17)
  private BigDecimal longitude;

  private int liveCount;

  @OneToOne(fetch = FetchType.LAZY)
  private User member;

  @ManyToOne(fetch = FetchType.LAZY)
  private Dongcodes dongcodes;

  public void update(String title, String content, String registrationNumber,
      String tel, String address, String y,
      String x, Dongcodes dongcodes) {

    // 좌표 변환
    double[] latLon = CoordinateConverter.convertToLatLon(
        Double.parseDouble(x),
        Double.parseDouble(y)
    );

    // 타입 변환
    BigDecimal latitude = BigDecimal.valueOf(latLon[0]);
    BigDecimal longitude = BigDecimal.valueOf(latLon[1]);


    this.title = title;
    this.content = content;
    this.registrationNumber = registrationNumber;
    this.tel = tel;
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.dongcodes = dongcodes;
  }

}
