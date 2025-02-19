package com.ssafy.igeolu.global.util;

import org.locationtech.proj4j.CRSFactory;
import org.locationtech.proj4j.CoordinateReferenceSystem;
import org.locationtech.proj4j.CoordinateTransform;
import org.locationtech.proj4j.CoordinateTransformFactory;
import org.locationtech.proj4j.ProjCoordinate;

public class CoordinateConverter {

	public static double[] convertToLatLon(double x, double y) {

		// lat, long 으로 들어오면 그대로 반환
		if (!isEPSG5179(x, y)) {
			return new double[]{y, x};
		}

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

	private static boolean isEPSG5179(double x, double y) {
		// EPSG:5179 (UTM-K) 범위
        return (x >= 900000 && x <= 2000000) && (y >= 1800000 && y <= 2900000);
    }
}