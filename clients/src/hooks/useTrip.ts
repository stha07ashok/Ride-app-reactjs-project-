import { useEffect, useRef, useState } from "react";
import type { Position, Ride } from "../types/types";
import {
  publishRequest,
  publishUpdate,
  publishAccept,
  publishComplete,
  publishCancel,
  onRequest,
  onAccept,
  onComplete,
  onCancel,
} from "../services/realtime";
import { saveRide } from "../services/history";

type LocalRide = Ride & { simulated?: boolean };

export function useTrip(clientId: string) {
  const [pending, setPending] = useState<Ride[]>([]);
  const [active, setActive] = useState<Ride | null>(null);
  const movingRef = useRef<any>(null);

  useEffect(() => {
    const unsub = onRequest((ride) => {
      setPending((p) => {
        // ignore duplicates
        if (p.find((r) => r.id === ride.id)) return p;
        return [...p, ride];
      });
    });
    const unsubAccept = onAccept((ride) => {
      setPending((p) => p.filter((r) => r.id !== ride.id));
      setActive(ride);
    });
    const unsubComplete = onComplete((ride) => {
      setActive((a) => (a && a.id === ride.id ? ride : a));
    });
    const unsubCancel = onCancel((ride) => {
      setPending((p) => p.filter((r) => r.id !== ride.id));
      setActive((a) => (a && a.id === ride.id ? null : a));
    });

    return () => {
      unsub();
      unsubAccept();
      unsubComplete();
      unsubCancel();
    };
  }, []);

  function requestRide(
    pickup: Position,
    dropoff: Position,
    pickupAddress?: string,
    dropoffAddress?: string,
  ) {
    const ride: LocalRide = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? (crypto as any).randomUUID()
          : Math.random().toString(36).slice(2, 9),
      riderId: clientId,
      pickup,
      dropoff,
      pickupAddress: pickupAddress,
      dropoffAddress: dropoffAddress,
      status: "requested",
      createdAt: new Date().toISOString(),
    } as Ride;
    publishRequest(ride);
    setPending((p) => [...p, ride]);
    return ride;
  }

  function acceptRide(rideId: string, driverId: string) {
    setPending((p) => p.filter((r) => r.id !== rideId));
    const ride = pending.find((r) => r.id === rideId);
    if (!ride) return;
    const accepted: Ride = {
      ...ride,
      driverId,
      status: "accepted",
      updatedAt: new Date().toISOString(),
    };
    publishUpdate(accepted);
    publishAccept(accepted);
    setActive(accepted);
    return accepted;
  }

  function cancelRide(ride: Ride) {
    const cancelled: Ride = {
      ...ride,
      status: "cancelled",
      updatedAt: new Date().toISOString(),
    };
    publishCancel(cancelled);
    setPending((p) => p.filter((r) => r.id !== ride.id));
    setActive((a) => (a && a.id === ride.id ? null : a));
    return cancelled;
  }

  async function completeRide(ride: Ride) {
    const finalRide: Ride = {
      ...ride,
      status: "completed",
      updatedAt: new Date().toISOString(),
    };
    publishComplete(finalRide);
    await saveRide(finalRide);
    setActive(null);
    return finalRide;
  }

  return { pending, active, requestRide, acceptRide, cancelRide, completeRide };
}
