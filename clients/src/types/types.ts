export type Role = "rider" | "driver";

export type Position = {
  lat: number;
  lng: number;
};

export type RideStatus =
  | "requested"
  | "accepted"
  | "enroute"
  | "completed"
  | "cancelled"
  | "cancellride";

export type Ride = {
  id: string;
  riderId: string;
  driverId?: string;
  currentPosition?: Position;
  pickup: Position;
  dropoff: Position;
  pickupAddress?: string;
  dropoffAddress?: string;
  status: RideStatus;
  createdAt: string;
  updatedAt?: string;
};
