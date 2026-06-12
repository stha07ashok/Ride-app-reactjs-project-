import type { Ride } from "../types/types";

const MOCK_API_URL = "https://6a2b8c88b687a7d5cbc569ce.mockapi.io/ride/api/rides";

export async function saveRideToHistory(ride: Ride): Promise<void> {
  try {
    const response = await fetch(MOCK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rideId: ride.id,
        riderId: ride.riderId,
        driverId: ride.driverId || null,
        pickup: ride.pickup,
        dropoff: ride.dropoff,
        pickupAddress: ride.pickupAddress || "",
        dropoffAddress: ride.dropoffAddress || "",
        status: ride.status,
        createdAt: ride.createdAt,
        updatedAt: ride.updatedAt || new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save ride: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error saving ride to REST history:", error);
  }
}

export async function fetchRideHistory(): Promise<Ride[]> {
  try {
    const response = await fetch(MOCK_API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch history: ${response.statusText}`);
    }
    const data = await response.json();
    return data.map((item: any) => ({
      id: item.id,
      riderId: item.riderId,
      driverId: item.driverId || undefined,
      pickup: item.pickup,
      dropoff: item.dropoff,
      pickupAddress: item.pickupAddress || undefined,
      dropoffAddress: item.dropoffAddress || undefined,
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt || undefined,
    }));
  } catch (error) {
    console.error("Error fetching ride history from REST:", error);
    return [];
  }
}
