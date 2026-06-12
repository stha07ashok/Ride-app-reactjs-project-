import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { fetchRideHistory } from "../services/history";
import type { Ride } from "../types/types";

export default function HistoryPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await fetchRideHistory();
        // Sort by date descending
        data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRides(data);
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Ride History</h1>
            <p className="text-sm text-gray-500 mt-1">
              Transaction logs persisted via mock REST API.
            </p>
          </div>
          <Link
            to="/"
            className="bg-yellow-500 text-white font-semibold px-4 py-2 rounded shadow-lg hover:bg-yellow-600 hover:scale-110 hover:cursor-pointer transition duration-150 inline-flex items-center gap-2"
          >
            ← Back to Map
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Fetching persistent logs...</p>
          </div>
        ) : rides.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center space-y-4 max-w-md mx-auto">
            <div className="text-5xl">📂</div>
            <h3 className="text-xl font-bold text-gray-800">No History Found</h3>
            <p className="text-sm text-gray-500">
              Completed or cancelled rides will automatically save here using standard HTTP REST requests.
            </p>
            <Link
              to="/"
              className="inline-block bg-yellow-500 text-white font-bold px-6 py-2 rounded-full hover:bg-yellow-600 hover:scale-110 hover:cursor-pointer transition duration-150"
            >
              Start a Ride
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className=" text-xs font-bold uppercase text-gray-600 border-b">
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Ride ID</th>
                    <th className="px-6 py-4">Pickup Address</th>
                    <th className="px-6 py-4">Dropoff Address</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {rides.map((ride) => (
                    <tr key={ride.id} className="hover:bg-gray-50/50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">
                        {dayjs(ride.createdAt).format("MMM DD, YYYY hh:mm A")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400 font-mono">
                        {ride.id}
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={ride.pickupAddress}>
                        {ride.pickupAddress || (ride.pickup && typeof ride.pickup.lat === "number" && typeof ride.pickup.lng === "number"
                          ? `${ride.pickup.lat.toFixed(4)}, ${ride.pickup.lng.toFixed(4)}`
                          : "N/A")}
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={ride.dropoffAddress}>
                        {ride.dropoffAddress || (ride.dropoff && typeof ride.dropoff.lat === "number" && typeof ride.dropoff.lng === "number"
                          ? `${ride.dropoff.lat.toFixed(4)}, ${ride.dropoff.lng.toFixed(4)}`
                          : "N/A")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                            ride.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : ride.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {ride.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 divide-y divide-gray-100 md:hidden">
              {rides.map((ride) => (
                <div key={ride.id} className="p-4 space-y-3 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400">
                      ID: {ride.id}
                    </span>
                    <span
                      className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-full ${
                        ride.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : ride.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {ride.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {dayjs(ride.createdAt).format("MMM DD, YYYY hh:mm A")}
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-400">PICKUP</div>
                    <div className="text-sm text-gray-700 font-medium">
                      {ride.pickupAddress || (ride.pickup && typeof ride.pickup.lat === "number" && typeof ride.pickup.lng === "number"
                        ? `${ride.pickup.lat.toFixed(4)}, ${ride.pickup.lng.toFixed(4)}`
                        : "N/A")}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-400">DROPOFF</div>
                    <div className="text-sm text-gray-700 font-medium">
                      {ride.dropoffAddress || (ride.dropoff && typeof ride.dropoff.lat === "number" && typeof ride.dropoff.lng === "number"
                        ? `${ride.dropoff.lat.toFixed(4)}, ${ride.dropoff.lng.toFixed(4)}`
                        : "N/A")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
