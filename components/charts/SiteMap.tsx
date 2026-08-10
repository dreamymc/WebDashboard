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
}

export default function SiteMap({ markers, height = 400 }: SiteMapProps) {
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

  // Philippines bounding box center approximately
  const center: [number, number] = [12.8797, 121.774];

  return (
    <div style={{ height, width: "100%", zIndex: 0 }} className="relative z-0">
      <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='Tiles &copy; Esri'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />
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
