import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function ProfilePanel({ onClose }: { onClose?: () => void }) {
  const { user, updateProfile, logout } = useAuth();
  const [name, setName] = useState<string>(user?.name ?? "");
  const [email] = useState<string>(user?.email ?? "");

  useEffect(() => {
    setName(user?.name ?? "");
  }, [user]);

  function handleSave() {
    updateProfile({ name: name || undefined });
    if (onClose) onClose();
  }

  function handleLogout() {
    logout();
    toast.success("Logout successful");
    if (onClose) onClose();
  }

  if (!user) return null;

  return (
    <div
      className="absolute right-0 top-full mt-2 w-72 bg-white profile-panel rounded-md shadow-lg p-6 max-sm:fixed max-sm:inset-x-4 max-sm:top-20 max-sm:w-auto"
      style={{ zIndex: 9999 }}
    >
      <div className="font-semibold mb-2">Profile</div>
      <label
        htmlFor="profile-name"
        className="text-sm text-gray-600 mb-1 block"
      >
        Name
      </label>
      <input
        id="profile-name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        title="Full name"
        placeholder="e.g., Ashok Shrestha"
        className="w-full border rounded px-2 py-1 mb-2 text-sm bg-gray-50"
      />
      <label
        htmlFor="profile-email"
        className="text-sm text-gray-600 mb-1 block"
      >
        Email
      </label>
      <input
        id="profile-email"
        name="email"
        value={email}
        readOnly
        title="Email address"
        className="w-full border rounded px-2 py-1 mb-2 text-sm bg-gray-50"
      />
      <div className="text-sm text-gray-600 mb-2">
        Role: <span className="font-medium">{user?.role}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 bg-yellow-500 hover:bg-yellow-600  py-2 rounded-full shadow-lg"
        >
          Save
        </button>
      </div>

      <div className="mt-3 border-t pt-3">
        <button
          onClick={handleLogout}
          className="w-full text-center rounded-full py-2 shadow-lg bg-yellow-500 hover:bg-yellow-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
