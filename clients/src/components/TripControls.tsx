import React from "react";
import type { Position, Ride } from "../types/types";

export function RiderControls({
  pickup,
  dropoff,
  onRequest,
  onClear,
}: {
  pickup?: Position | null;
  dropoff?: Position | null;
  onRequest: () => void;
  onClear: () => void;
}) {
  return (
    <div className="p-3 bg-white rounded shadow space-y-3">
      <div className="text-sm text-gray-600">
        Pickup:{" "}
        <span className="font-medium">
          {pickup
            ? `${pickup.lat.toFixed(4)}, ${pickup.lng.toFixed(4)}`
            : "(click map)"}
        </span>
      </div>
      <div className="text-sm text-gray-600">
        Dropoff:{" "}
        <span className="font-medium">
          {dropoff
            ? `${dropoff.lat.toFixed(4)}, ${dropoff.lng.toFixed(4)}`
            : "(click map)"}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onRequest}
          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
        >
          Request Ride
        </button>
        <button onClick={onClear} className="flex-1 border rounded py-2">
          Clear
        </button>
      </div>
    </div>
  );
}

export function DriverControls({
  pending,
  onAccept,
}: {
  pending: Ride[];
  onAccept: (rideId: string) => void;
}) {
  return (
    <div className="p-3 bg-white rounded shadow">
      <div className="font-semibold mb-2">Incoming Requests</div>
      <div className="space-y-2 max-h-60 overflow-auto">
        {pending.length === 0 && (
          <div className="text-sm text-gray-500">No requests</div>
        )}
        {pending.map((r) => (
          <div
            key={r.id}
            className="p-2 border rounded flex items-center justify-between"
          >
            <div className="text-sm">
              <div className="font-medium">
                {r.pickupAddress ??
                  `${r.pickup.lat.toFixed(4)}, ${r.pickup.lng.toFixed(4)}`}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(r.createdAt).toLocaleTimeString()}
              </div>
              {r.dropoffAddress && (
                <div className="text-xs text-gray-400">
                  → {r.dropoffAddress}
                </div>
              )}
            </div>
            <button
              onClick={() => onAccept(r.id)}
              className="text-sm bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Accept
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
