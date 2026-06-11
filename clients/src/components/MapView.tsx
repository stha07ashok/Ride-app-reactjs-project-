import React, { useMemo, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
  useMap,
} from "react-leaflet";
import type { Position } from "../types/types";
import { reverseGeocode } from "../services/geocode";
import L from "leaflet";

const kathmandu: Position = { lat: 27.7172, lng: 85.324 };

function ClickHandler({ onClick }: { onClick?: (pos: Position) => void }) {
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      onClick?.({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function MapView({
  center = kathmandu,
  markers = [],
  route = [],
  onMapClick,
  onSetPickup,
  onSetDropoff,
  onSetPickupAddress,
  onSetDropoffAddress,
}: {
  center?: Position;
  markers?: { id: string; pos: Position; label?: string; color?: string }[];
  route?: [number, number][];
  onMapClick?: (pos: Position) => void;
  onSetPickup?: (pos: Position) => void;
  onSetDropoff?: (pos: Position) => void;
  onSetPickupAddress?: (address: string) => void;
  onSetDropoffAddress?: (address: string) => void;
}) {
  const [currentPos, setCurrentPos] = useState<Position | null>(null);
  const [manual, setManual] = useState<string>("");

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) =>
          setCurrentPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => undefined,
        { enableHighAccuracy: true, maximumAge: 1000 * 60 },
      );
    }
  }, []);

  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const icon = useMemo(() => {
    return L.divIcon({
      className: "custom-div-icon",
      html: "<div style='width:18px;height:18px;border-radius:9px;background:yellow;border:2px solid white;box-shadow:0 0 0 2px rgba(0,0,0,0.08)'></div>",
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
  }, []);

  const currentIcon = useMemo(() => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="36" style="display:block;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.25));">
        <path fill="#ef4444" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.999 2.5 2.5 0 0 1 12 11.5z"/>
      </svg>
    `;
    return L.divIcon({
      html: svg,
      className: "current-location-pin",
      iconSize: [28, 36],
      iconAnchor: [14, 36],
    });
  }, []);

  function MapUpdater({ center }: { center: Position }) {
    const map = useMap();
    useEffect(() => {
      if (!map) return;
      map.setView([center.lat, center.lng], map.getZoom());
    }, [center.lat, center.lng, map]);
    return null;
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        className="h-full w-full rounded"
      >
        <MapUpdater center={center} />
        <TileLayer url={tileUrl} />
        <ClickHandler onClick={onMapClick} />

        {currentPos && (
          <Marker position={[currentPos.lat, currentPos.lng]} icon={currentIcon}>
            <Popup>
              <div className="font-semibold">You are here</div>
              <div className="text-xs text-gray-500">
                {currentPos.lat.toFixed(4)}, {currentPos.lng.toFixed(4)}
              </div>
            </Popup>
          </Marker>
        )}

        {markers.map((m) => (
          <Marker key={m.id} position={[m.pos.lat, m.pos.lng]} icon={icon}>
            <Popup>
              <div className="font-semibold">{m.label ?? "Marker"}</div>
              <div className="text-xs text-gray-500">
                {m.pos.lat.toFixed(4)}, {m.pos.lng.toFixed(4)}
              </div>
            </Popup>
          </Marker>
        ))}

        {route.length > 1 && (
          <Polyline
            positions={route}
            pathOptions={{ color: "#3b82f6", weight: 4, opacity: 0.7 }}
          />
        )}
      </MapContainer>

      {/* Floating control outside MapContainer so Leaflet's z-index CSS doesn't apply */}
      <div className="absolute top-2 right-2 z-[1100] bg-white floating-controls p-3 rounded shadow-lg w-64 md:w-80 pointer-events-auto">
        <div className="font-semibold mb-2">
          Select Destination / Use Current
        </div>
        <div className="text-xs text-gray-500 mb-2">
          Click on the map to pick a point or use your current location.
        </div>
        <div className="mb-2">
          <div className="text-[12px] text-gray-600">Current location</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 text-sm text-gray-700">
              {currentPos
                ? `${currentPos.lat.toFixed(4)}, ${currentPos.lng.toFixed(4)}`
                : "Unknown"}
            </div>
            <button
              onClick={async () => {
                if (!currentPos) return;
                if (onSetPickup) onSetPickup(currentPos);
                const addr = await reverseGeocode(currentPos);
                if (addr && onSetPickupAddress) onSetPickupAddress(addr);
              }}
              className="text-sm bg-red-500 text-white px-2 py-1 rounded whitespace-nowrap"
            >
              Use as Pickup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
