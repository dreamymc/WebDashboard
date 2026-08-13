"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default icon issue with webpack
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// We must dynamically import the leaflet components because they require the window object
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const MapFocus = dynamic(() => import("./MapFocus"), { ssr: false });

interface SiteMarker {
  id: string; // SERIAL NUMBER
  lat: number;
  long: number;
  stage: string;
  color: string;
  name: string;
}

interface SiteMapProps {
  markers: SiteMarker[];
  height?: number | string;
  focusedMarkerId?: string | null;
}

export default function SiteMap({ markers, height = 400, focusedMarkerId }: SiteMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="flex items-center justify-center bg-surface border border-border-color"
        style={{ height }}
      >
        <span className="text-sm text-text-muted">Loading map...</span>
      </div>
    );
  }

  // Mindanao bounding box center approximately (shifted south to fit GenSan)
  const defaultCenter: [number, number] = [7.2, 125.0];
  const focusedMarker = focusedMarkerId ? markers.find(m => m.id === focusedMarkerId) : null;
  const initialCenter = focusedMarker ? ([focusedMarker.lat, focusedMarker.long] as [number, number]) : defaultCenter;

  return (
    <div style={{ height, width: "100%", zIndex: 0 }} className="relative z-0">
      <MapContainer
        center={initialCenter}
        zoom={focusedMarker ? 14 : 7}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; Google Maps'
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
        />
        {focusedMarker && <MapFocus lat={focusedMarker.lat} lng={focusedMarker.long} />}
        {markers.map((marker) => (
          <CircleMarker
            key={marker.id}
            center={[marker.lat, marker.long]}
            radius={4}
            pathOptions={{
              color: marker.color,
              fillColor: marker.color,
              fillOpacity: 0.8,
              weight: 1,
            }}
          >
            <Popup>
              <div className="text-xs">
                <strong className="block mb-1">{marker.id}</strong>
                <span className="text-text-secondary">{marker.name}</span>
                <br />
                <span
                  style={{ color: marker.color }}
                  className="font-semibold uppercase tracking-wider text-[10px]"
                >
                  {marker.stage}
                </span>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
