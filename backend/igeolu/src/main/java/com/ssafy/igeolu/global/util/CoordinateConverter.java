package com.ssafy.igeolu.global.util;

import org.locationtech.proj4j.CRSFactory;
import org.locationtech.proj4j.CoordinateReferenceSystem;
import org.locationtech.proj4j.CoordinateTransform;
import org.locationtech.proj4j.CoordinateTransformFactory;
import org.locationtech.proj4j.ProjCoordinate;

public class CoordinateConverter {

	public static double[] convertToLatLon(double x, double y) {

		CRSFactory crsFactory = new CRSFactory();
		CoordinateReferenceSystem sourceCRS = crsFactory.createFromName("EPSG:5179");
		CoordinateReferenceSystem targetCRS = crsFactory.createFromName("EPSG:4326");

		ProjCoordinate sourceCoord = new ProjCoordinate(x, y);
		ProjCoordinate targetCoord = new ProjCoordinate();

		CoordinateTransformFactory ctFactory = new CoordinateTransformFactory();
		CoordinateTransform transform = ctFactory.createTransform(sourceCRS, targetCRS);
		transform.transform(sourceCoord, targetCoord);

		return new double[] {targetCoord.y, targetCoord.x}; // [latitude, longitude]
	}
}