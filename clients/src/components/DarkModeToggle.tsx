import React from "react";
import { useDarkMode } from "../hooks/useDarkMode";

export default function DarkModeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useDarkMode();

  return (
    <div className={className}>
      <button
        onClick={() => setDark((d) => !d)}
        aria-pressed={dark}
        title={dark ? "Switch to light mode" : "Switch to dark mode"}
        className={`w-10 h-10 rounded-full flex items-center justify-center focus:outline-none transition-colors text-sm ${
          dark ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
        }`}
      >
        <span aria-hidden>{dark ? "☀️" : "🌙"}</span>
      </button>
    </div>
  );
}
