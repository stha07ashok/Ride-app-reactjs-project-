import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfilePanel from "./ProfilePanel";
import DarkModeToggle from "./DarkModeToggle";

export default function Header({
  onSidebarOpen,
}: {
  onSidebarOpen?: () => void;
}) {
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
    <header className="relative z-50 flex items-center justify-between px-4 py-3 bg-gray-100 border-b shadow-lg">
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
      <div className="flex items-center gap-3">
        <DarkModeToggle />

        {user ? (
          <>
            <Link
              to="/history"
              className="text-sm font-semibold text-gray-600 hover:text-yellow-600 px-3 py-1 rounded border border-gray-200 bg-white shadow-sm hover:scale-105 transition duration-150 inline-flex items-center gap-1.5 max-sm:hidden"
            >
              📜 History
            </Link>

            {user.email === import.meta.env.VITE_TEST_EMAIL ? (
              <div className="flex gap-1 bg-white border rounded p-1 shadow-sm max-sm:hidden">
                <Link
                  to="/rider"
                  className="px-3 py-1 text-xs font-bold rounded bg-gray-50 hover:bg-yellow-400 hover:text-white transition duration-150 inline-block text-gray-700"
                >
                  Rider View
                </Link>
                <Link
                  to="/driver"
                  className="px-3 py-1 text-xs font-bold rounded bg-gray-50 hover:bg-yellow-400 hover:text-white transition duration-150 inline-block text-gray-700"
                >
                  Driver View
                </Link>
              </div>
            ) : (
              <div className="px-3 py-1 rounded text-sm bg-white border text-gray-700 max-sm:hidden">
                {user.role === "rider" ? "Rider" : "Driver"}
              </div>
            )}

            <button
              onClick={() => setOpen((v) => !v)}
              className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-semibold text-white max-sm:hidden"
              aria-label="Profile"
            >
              {initials}
            </button>

            {open && <ProfilePanel onClose={() => setOpen(false)} />}

            <button
              onClick={() => onSidebarOpen?.()}
              className="sm:hidden w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200"
              aria-label="Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
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
