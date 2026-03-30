"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  Marker,
  Circle,
  useMap,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import { useAppStore } from "@/store/useAppStore";
import { MAP_CONFIG } from "@/lib/constants/config";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icons in Next.js
function createNumberedIcon(num: number, isActive: boolean): L.DivIcon {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      display:flex;align-items:center;justify-content:center;
      width:${isActive ? "34px" : "28px"};height:${isActive ? "34px" : "28px"};
      background:#D4541B;color:white;border-radius:50%;
      font-size:12px;font-weight:700;
      border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);
      transition:all 0.15s ease;
    ">${num}</div>`,
    iconSize: isActive ? [34, 34] : [28, 28],
    iconAnchor: isActive ? [17, 17] : [14, 14],
  });
}

const searchIcon = L.divIcon({
  className: "search-marker",
  html: `<div style="
    width:20px;height:20px;
    background:#D4541B;border:3px solid white;
    border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

/** Syncs map center when selectedLocation changes */
function MapUpdater() {
  const map = useMap();
  const selectedLocation = useAppStore((s) => s.selectedLocation);

  useEffect(() => {
    if (selectedLocation) {
      map.setView(
        [selectedLocation.lat, selectedLocation.lng],
        MAP_CONFIG.defaultZoom,
        { animate: true }
      );
    }
  }, [map, selectedLocation]);

  return null;
}

export function MapContainer() {
  const selectedLocation = useAppStore((s) => s.selectedLocation);
  const results = useAppStore((s) => s.results);
  const activeMarkerId = useAppStore((s) => s.activeMarkerId);
  const setActiveMarker = useAppStore((s) => s.setActiveMarker);
  const filters = useAppStore((s) => s.filters);
  const containerRef = useRef<HTMLDivElement>(null);

  const center = useMemo(
    () =>
      selectedLocation
        ? { lat: selectedLocation.lat, lng: selectedLocation.lng }
        : { lat: 18.5204, lng: 73.8567 }, // Default: Pune
    [selectedLocation]
  );

  const tomtomKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY;
  const tileUrl = tomtomKey
    ? `https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=${tomtomKey}`
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const attribution = tomtomKey
    ? '&copy; <a href="https://www.tomtom.com">TomTom</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  return (
    <div ref={containerRef} className="h-full w-full">
      <LeafletMapContainer
        center={[center.lat, center.lng]}
        zoom={MAP_CONFIG.defaultZoom}
        className="h-full w-full z-0"
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer url={tileUrl} attribution={attribution} />

        <MapUpdater />

        {/* Search location marker */}
        {selectedLocation && (
          <Marker
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={searchIcon}
            zIndexOffset={1000}
          />
        )}

        {/* Radius circle */}
        {selectedLocation && (
          <Circle
            center={[selectedLocation.lat, selectedLocation.lng]}
            radius={filters.radius}
            pathOptions={{
              fillColor: "#D4541B",
              fillOpacity: 0.05,
              color: "#D4541B",
              opacity: 0.2,
              weight: 1,
            }}
          />
        )}

        {/* Result markers */}
        {results.map((result, index) => (
          <Marker
            key={result.placeId}
            position={[result.lat, result.lng]}
            icon={createNumberedIcon(
              index + 1,
              activeMarkerId === result.placeId
            )}
            eventHandlers={{
              click: () => {
                setActiveMarker(result.placeId);
                const card = document.getElementById(
                  `result-card-${result.placeId}`
                );
                if (card) {
                  card.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                  });
                }
              },
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{result.name}</p>
                {result.rating > 0 && (
                  <p className="text-xs text-gray-600">
                    Rating: {result.rating} | {result.distance} km
                  </p>
                )}
                {result.phone && (
                  <a
                    href={`tel:${result.phone}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {result.phone}
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </LeafletMapContainer>
    </div>
  );
}
