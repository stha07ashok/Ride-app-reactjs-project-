import { useEffect, useState } from "react";
import {
  ref,
  push,
  update,
  onValue,
  serverTimestamp,
} from "firebase/database";
import { db } from "../services/firebase";
import type { Position, Ride } from "../types/types";
import { saveRideToHistory } from "../services/history";

function docToRide(id: string, data: any): Ride {
  return {
    id,
    riderId: data.riderId,
    driverId: data.driverId ?? undefined,
    pickup: data.pickup ?? { lat: 0, lng: 0 },
    dropoff: data.dropoff ?? { lat: 0, lng: 0 },
    pickupAddress: data.pickupAddress ?? undefined,
    dropoffAddress: data.dropoffAddress ?? undefined,
    currentPosition: data.currentPosition ?? undefined,
    status: data.status ?? "requested",
    createdAt: data.createdAt
      ? new Date(data.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: data.updatedAt
      ? new Date(data.updatedAt).toISOString()
      : undefined,
  };
}

const ridesRef = ref(db, "rides");

export function useTrip(clientId: string) {
  const [pending, setPending] = useState<Ride[]>([]);
  const [active, setActive] = useState<Ride | null>(null);

  useEffect(() => {
    const unsub = onValue(ridesRef, (snapshot) => {
      const all: Ride[] = [];
      snapshot.forEach((childSnap) => {
        all.push(docToRide(childSnap.key!, childSnap.val()));
      });

      setPending(all.filter((r) => r.status === "requested"));

      const myActive = all.find(
        (r) =>
          (r.riderId === clientId || r.driverId === clientId) &&
          (r.status === "accepted" || r.status === "enroute"),
      );
      setActive(myActive ?? null);
    });

    return () => unsub();
  }, [clientId]);

  async function requestRide(
    pickup: Position,
    dropoff: Position,
    pickupAddress?: string,
    dropoffAddress?: string,
  ) {
    await push(ridesRef, {
      riderId: clientId,
      pickup,
      dropoff,
      pickupAddress: pickupAddress ?? null,
      dropoffAddress: dropoffAddress ?? null,
      status: "requested",
      createdAt: serverTimestamp(),
    });
  }

  async function acceptRide(rideId: string, driverId: string) {
    await update(ref(db, "rides/" + rideId), {
      driverId,
      status: "accepted",
      updatedAt: serverTimestamp(),
    });
  }

  async function cancelRide(ride: Ride) {
    const updatedRide: Ride = {
      ...ride,
      status: "cancelled",
      updatedAt: new Date().toISOString(),
    };
    await update(ref(db, "rides/" + ride.id), {
      status: "cancelled",
      updatedAt: serverTimestamp(),
    });
    await saveRideToHistory(updatedRide);
  }

  async function completeRide(ride: Ride) {
    const updatedRide: Ride = {
      ...ride,
      status: "completed",
      updatedAt: new Date().toISOString(),
    };
    await update(ref(db, "rides/" + ride.id), {
      status: "completed",
      updatedAt: serverTimestamp(),
    });
    await saveRideToHistory(updatedRide);
  }

  return { pending, active, requestRide, acceptRide, cancelRide, completeRide };
}
