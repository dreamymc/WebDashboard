"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapFocus({ lat, lng, zoom = 14 }: { lat: number; lng: number; zoom?: number }) {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], zoom, { animate: true, duration: 1.5 });
    }
  }, [map, lat, lng, zoom]);

  return null;
}
