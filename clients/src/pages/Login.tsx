import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await login(email, password);
    if (!ok) return setError("Invalid credentials");
    toast.success("Login successful");
    const role = email === "intern@namlotechrider.com" ? "rider" : "driver";
    nav(role === "rider" ? "/rider" : "/driver");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow px-6 py-8">
        <h2 className="text-2xl font-bold text-yellow-600 mb-4">
          Namlo Rides — Login
        </h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-200 rounded px-3 py-2"
              placeholder="intern@namlotechrider.com (rider) or intern@namlotechdriver.com (driver)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-200 rounded px-3 py-2"
              placeholder="namlo2026"
            />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded">
            Sign in
          </button>
        </form>
        <div className="mt-4 text-xs text-gray-500">
          Testing credentials (use the exact email):
          <ul className="list-disc list-inside">
            <li>Rider: intern@namlotechrider.com</li>
            <li>Driver: intern@namlotechdriver.com</li>
            <li>Password for both: namlo2026</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
