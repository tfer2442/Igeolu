package com.ssafy.igeolu.util;

import org.locationtech.proj4j.CRSFactory;
import org.locationtech.proj4j.CoordinateReferenceSystem;
import org.locationtech.proj4j.CoordinateTransform;
import org.locationtech.proj4j.CoordinateTransformFactory;
import org.locationtech.proj4j.ProjCoordinate;
import org.springframework.stereotype.Component;

@Component
public class CoordinateConverter {

	public double[] convertToLatLon(double x, double y) {

		CRSFactory crsFactory = new CRSFactory();
		CoordinateReferenceSystem sourceCRS = crsFactory.createFromName("EPSG:5174");
		CoordinateReferenceSystem targetCRS = crsFactory.createFromName("EPSG:4326");


		ProjCoordinate sourceCoord = new ProjCoordinate(x, y);
		ProjCoordinate targetCoord = new ProjCoordinate();


		CoordinateTransformFactory ctFactory = new CoordinateTransformFactory();
		CoordinateTransform transform = ctFactory.createTransform(sourceCRS, targetCRS);
		transform.transform(sourceCoord, targetCoord);


		return new double[]{targetCoord.y, targetCoord.x}; // [latitude, longitude]
	}
}