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
  const testEmailRider  = import.meta.env.VITE_TEST_EMAIL_RIDER;
  const testEmailDriver  = import.meta.env.VITE_TEST_EMAIL_DRIVER;
  const testPassword = import.meta.env.VITE_TEST_PASSWORD;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await login(email, password);
    if (!ok) return setError("Invalid credentials");
    toast.success("Login successful");
    const role = email === testEmailRider ? "rider" : "driver";
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
              placeholder={testEmailRider}
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
              placeholder={testPassword}
            />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded">
            Sign in
          </button>
        </form>
        <div className="mt-4 text-xs text-gray-500 gap-2 flex flex-col">
          Testing credentials:
          <p className="font-semibold text-gray-700">RIDER:</p>
          <ul className="list-disc list-inside font-semibold mb-2">
            <li>Username: {testEmailRider}</li>
            <li>Password: {testPassword}</li>
          </ul>
          <p className="font-semibold text-gray-700">DRIVER:</p>
          <ul className="list-disc list-inside font-semibold">
            <li>Username: {testEmailDriver}</li>
            <li>Password: {testPassword}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
