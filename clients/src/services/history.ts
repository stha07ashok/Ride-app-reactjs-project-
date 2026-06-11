import type { Ride } from "../types/types";

const LOCAL_KEY = "namlo_ride_history";

export async function saveRide(ride: Ride) {
  const endpoint = import.meta.env.VITE_HISTORY_ENDPOINT;
  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ride),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // fall through to local save
    }
  }

  const raw = localStorage.getItem(LOCAL_KEY);
  const arr: Ride[] = raw ? JSON.parse(raw) : [];
  arr.push(ride);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(arr));
  return ride;
}

export async function fetchHistory() {
  const endpoint = import.meta.env.VITE_HISTORY_ENDPOINT;
  if (endpoint) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch (e) {
      // fall back
    }
  }
  const raw = localStorage.getItem(LOCAL_KEY);
  return raw ? JSON.parse(raw) : [];
}
