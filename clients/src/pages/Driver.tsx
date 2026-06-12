import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import MapView from "../components/MapView";
import { DriverControls } from "../components/TripControls";
import { useTrip } from "../hooks/useTrip";
import { fetchRoute } from "../services/geocode";

export default function DriverPage() {
  const { user } = useAuth();
  const testEmailDriver = import.meta.env.VITE_TEST_EMAIL_DRIVER;
  const clientId = user?.email === testEmailDriver ? "user-driver" : (user?.id ?? "anon");
  const { pending, active, acceptRide, completeRide } = useTrip(clientId);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  useEffect(() => {
    if (active?.pickup && active?.dropoff) {
      fetchRoute(active.pickup, active.dropoff).then(setRouteCoords);
    } else {
      setRouteCoords([]);
    }
  }, [active?.pickup, active?.dropoff]);

  const markers = useMemo(() => {
    const m: any[] = [];
    if (active) {
      const pos = (active.currentPosition ?? active.pickup) as any;
      m.push({ id: active.id, pos, label: `Ride ${active.status}` });
    }
    pending.forEach((r) =>
      m.push({ id: r.id, pos: r.pickup, label: "Requested" }),
    );
    return m;
  }, [pending, active]);

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 shadow-lg">
        <div className="md:col-span-2 h-full min-h-[50vh]">
          <MapView
            markers={markers}
            route={routeCoords}
            onMapClick={() => {}}
            onSetPickup={() => {}}
            onSetDropoff={() => {}}
            hideControls={true}
          />
        </div>
        <div className="space-y-4">
          <DriverControls
            pending={pending}
            onAccept={async (id) => {
              await acceptRide(id, clientId);
              toast.success("Ride accepted successfully");
            }}
          />

          <div className="p-3 bg-white rounded shadow-lg">
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
                      if (active) await completeRide(active);
                      toast.success("Ride completed successfully");
                    }}
                    className="flex-1 bg-yellow-500 text-white py-2 rounded"
                  >
                    Complete
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
