package com.ssafy.igeolu.domain.option.entity;

import lombok.Getter;

@Getter
public enum OptionName {
	ELEVATOR("엘레베이터"),
	BED("침대"),
	AIR_CONDITIONER("에어컨"),
	TV("TV"),
	DESK("책상"),
	WARDROBE("옷장"),
	PARKING("주차장"),
	MICROWAVE("전자렌지"),
	SHOWER_BOOTH("샤워부스"),
	CCTV("CCTV"),
	DOOR_SECURITY("현관보안"),
	REFRIGERATOR("냉장고"),
	DRYER("건조기"),
	DELIVERY_BOX("무인택배함"),
	INDUCTION("인덕션"),
	GAS_RANGE("가스레인지"),
	VERANDA("베란다"),
	OVEN("오븐"),
	WASHING_MACHINE("세탁기");

	private final String label;

	OptionName(String label) {
		this.label = label;
	}
}
