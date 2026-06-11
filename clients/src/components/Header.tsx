import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfilePanel from "./ProfilePanel";
import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const initials = user
    ? (user.name &&
        user.name
          .split(" ")
          .map((s) => s[0])
          .join("")) ||
      user.email.slice(0, 2).toUpperCase()
    : "NR";

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b">
      <Link
        to={user ? (user.role === "rider" ? "/rider" : "/driver") : "/"}
        className="flex items-center gap-3 no-underline"
        aria-label="Home"
      >
        <div className="w-10 h-10 rounded bg-yellow-400 flex items-center justify-center font-bold text-white">
          NR
        </div>
        <div>
          <div className="font-semibold">Namlo Rides</div>
          <div className="text-xs text-gray-500">Your Journey, Our Passion</div>
        </div>
      </Link>
      <div className="flex items-center gap-3 relative">
        <div>
          <DarkModeToggle />
        </div>
        {user ? (
          <>
            <div className="px-3 py-1 rounded text-sm bg-white border text-gray-700">
              {user.role === "rider" ? "Rider" : "Driver"}
            </div>

            <button
              onClick={() => setOpen((v) => !v)}
              className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-semibold text-white"
              aria-label="Profile"
            >
              {initials}
            </button>

            {open && <ProfilePanel onClose={() => setOpen(false)} />}
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-yellow-500 text-white px-3 py-1 rounded"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
