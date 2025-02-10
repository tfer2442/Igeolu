package com.ssafy.igeolu.domain.user.entity;

import java.math.BigDecimal;

import com.ssafy.igeolu.domain.dongcodes.entity.Dongcodes;

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

}
