import type { Position } from "../types/types";

export async function geocode(query: string): Promise<Position | null> {
  if (!query) return null;
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
      query,
    )}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    const item = data[0];
    return { lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
  } catch (e) {
    return null;
  }
}

export async function reverseGeocode(pos: Position): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.lat}&lon=${pos.lng}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.display_name ?? null;
  } catch (e) {
    return null;
  }
}

export async function fetchRoute(
  from: Position,
  to: Position,
): Promise<[number, number][]> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?geometries=geojson&overview=full`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.routes?.[0]?.geometry?.coordinates) return [];
    return data.routes[0].geometry.coordinates.map(
      (c: [number, number]) => [c[1], c[0]] as [number, number],
    );
  } catch (e) {
    return [];
  }
}
