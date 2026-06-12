import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import MapView from "../components/MapView";
import { RiderControls } from "../components/TripControls";
import { useTrip } from "../hooks/useTrip";
import type { Position } from "../types/types";

export default function RiderPage() {
  const { user } = useAuth();
  const testEmailRider = import.meta.env.VITE_TEST_EMAIL_RIDER;
  const clientId = user?.email === testEmailRider ? "user-rider" : (user?.id ?? "anon");
  const { active, requestRide, cancelRide } = useTrip(clientId);

  const [pickup, setPickup] = useState<Position | null>(null);
  const [dropoff, setDropoff] = useState<Position | null>(null);
  const [pickupAddress, setPickupAddress] = useState<string>("");
  const [dropoffAddress, setDropoffAddress] = useState<string>("");
  const [locating, setLocating] = useState(false);

  const markers = useMemo(() => {
    const m: any[] = [];
    if (pickup)
      m.push({ id: "pickup", pos: pickup, label: pickupAddress || "Pickup" });
    if (dropoff)
      m.push({
        id: "dropoff",
        pos: dropoff,
        label: dropoffAddress || "Dropoff",
      });
    if (active) {
      const pos = (active.currentPosition ?? active.pickup) as any;
      m.push({ id: active.id, pos, label: `Ride ${active.status}` });
    }
    return m;
  }, [pickup, dropoff, active]);

  function handleMapClick(pos: Position) {
    if (!pickup) setPickup(pos);
    else if (!dropoff) setDropoff(pos);
  }

  async function locateAddress(query: string, kind: "pickup" | "dropoff") {
    if (!query) return alert("Enter an address");
    setLocating(true);
    try {
      const { geocode } = await import("../services/geocode");
      const pos = await geocode(query);
      if (!pos) return alert("Location not found");
      if (kind === "pickup") setPickup(pos);
      else setDropoff(pos);
    } finally {
      setLocating(false);
    }
  }

  async function onRequest() {
    if (!pickup || !dropoff)
      return alert("Select pickup and dropoff by clicking the map");
    await requestRide(
      pickup,
      dropoff,
      pickupAddress || undefined,
      dropoffAddress || undefined,
    );
    toast.success("Ride requested successfully");
    setPickup(null);
    setDropoff(null);
    setPickupAddress("");
    setDropoffAddress("");
  }

  function onClear() {
    setPickup(null);
    setDropoff(null);
  }

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50">
        <div className="md:col-span-2 h-[70vh]">
          <MapView
            markers={markers}
            onMapClick={handleMapClick}
            onSetPickup={(pos) => setPickup(pos)}
            onSetDropoff={(pos) => setDropoff(pos)}
            onSetPickupAddress={(addr) => setPickupAddress(addr)}
            onSetDropoffAddress={(addr) => setDropoffAddress(addr)}
          />
        </div>
        <div className="space-y-4">
          <div className="p-3  rounded shadow">
            <div className="font-semibold mb-2">Enter Pickup & Dropoff</div>
            <div className="mb-2">
              <label className="block text-sm text-gray-600">
                Pickup address
              </label>
              <textarea
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                className="mt-1 block w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
                rows={2}
                placeholder="e.g. Lazimpat, Kathmandu"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => locateAddress(pickupAddress, "pickup")}
                  disabled={locating}
                  className="bg-yellow-500  px-3 py-1 rounded"
                >
                  Locate Pickup
                </button>
                <button
                  onClick={() => {
                    setPickupAddress("");
                    setPickup(null);
                  }}
                  className="border px-3 py-1 rounded"
                >
                  Clear
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600">
                Dropoff address
              </label>
              <textarea
                value={dropoffAddress}
                onChange={(e) => setDropoffAddress(e.target.value)}
                className="mt-1 block w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
                rows={2}
                placeholder="e.g. Thamel, Kathmandu"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => locateAddress(dropoffAddress, "dropoff")}
                  disabled={locating}
                  className="bg-yellow-500  px-3 py-1 rounded"
                >
                  Locate Dropoff
                </button>
                <button
                  onClick={() => {
                    setDropoffAddress("");
                    setDropoff(null);
                  }}
                  className="border px-3 py-1 rounded"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
          <RiderControls
            pickup={pickup}
            dropoff={dropoff}
            onRequest={onRequest}
            onClear={onClear}
          />

          <div className="p-3 bg-white rounded shadow">
            <div className="font-semibold mb-2">Current Ride Status</div>
            {active ? (
              <div className="space-y-2">
                <div className="text-sm">
                  Status: <span className="font-medium">{active.status}</span>
                </div>
                <div className="text-sm">
                  Pickup:{" "}
                  <span className="font-medium">
                    {active.pickupAddress ??
                      `${active.pickup.lat.toFixed(4)}, ${active.pickup.lng.toFixed(4)}`}
                  </span>
                </div>
                <div className="text-sm">
                  Dropoff:{" "}
                  <span className="font-medium">
                    {active.dropoffAddress ??
                      `${active.dropoff.lat.toFixed(4)}, ${active.dropoff.lng.toFixed(4)}`}
                  </span>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={async () => {
                      if (active) await cancelRide(active);
                      toast.success("Ride cancelled successfully");
                      setPickup(null);
                      setDropoff(null);
                      setPickupAddress("");
                      setDropoffAddress("");
                    }}
                    className="flex-1 bg-yellow-500  py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No active requests or rides</div>
            )}
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 py-2 border-t">
        &copy; {new Date().getFullYear()} Namlo Rides. All rights reserved.
      </div>
    </div>
  );
}
