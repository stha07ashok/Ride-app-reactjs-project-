import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user, updateProfile, logout } = useAuth();
  const [name, setName] = useState<string>(user?.name ?? "");
  const [email] = useState<string>(user?.email ?? "");

  useEffect(() => {
    setName(user?.name ?? "");
  }, [user]);

  function handleSave() {
    updateProfile({ name: name || undefined });
    onClose();
  }

  function handleLogout() {
    logout();
    toast.success("Logout successful");
    onClose();
  }

  if (!user) return null;

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-[9999] transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-semibold">Profile</div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="e.g., Ashok Shrestha"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input
              value={email}
              readOnly
              className="w-full border rounded px-2 py-1 text-sm bg-gray-50"
            />
          </div>

          {user?.email === import.meta.env.VITE_TEST_EMAIL ? (
            <div className="space-y-2">
              <div className="text-sm text-gray-600 font-medium">Dual-Role Switcher:</div>
              <div className="flex gap-2">
                <Link
                  to="/rider"
                  onClick={onClose}
                  className="flex-1 bg-gray-100 hover:bg-yellow-400 hover:text-white text-center py-2 rounded text-xs font-bold text-gray-700 transition"
                >
                  Rider View
                </Link>
                <Link
                  to="/driver"
                  onClick={onClose}
                  className="flex-1 bg-gray-100 hover:bg-yellow-400 hover:text-white text-center py-2 rounded text-xs font-bold text-gray-700 transition"
                >
                  Driver View
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              Role: <span className="font-medium">{user?.role}</span>
            </div>
          )}

          <button
            onClick={handleSave}
            className="w-full bg-yellow-500 text-white py-2 rounded-full shadow-lg"
          >
            Save
          </button>

          <div className="border-t pt-4">
            <Link
              to="/history"
              onClick={onClose}
              className="w-full bg-white hover:bg-gray-50 border text-center text-gray-700 py-2 rounded-full shadow-sm block font-semibold"
            >
              📜 Ride History
            </Link>
          </div>

          <div className="border-t pt-4">
            <button
              onClick={handleLogout}
              className="w-full bg-yellow-500 text-white py-2 rounded-full shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
