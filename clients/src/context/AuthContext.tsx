import React, { createContext, useContext, useState } from "react";
import type { Role } from "../types/types";

type User = {
  id: string;
  name?: string;
  email: string;
  role: Role;
};

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setRole: (r: Role) => void;
  updateProfile: (changes: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("namlo_user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (email: string, password: string) => {
    // Simple hardcoded authentication for evaluation/testing only.
    if (password !== "namlo2026") return false;

    if (email === "intern@namlotechrider.com") {
      const u: User = {
        id: "user-rider",
        name: "Rider Intern",
        email,
        role: "rider",
      };
      setUser(u);
      localStorage.setItem("namlo_user", JSON.stringify(u));
      return true;
    }

    if (email === "intern@namlotechdriver.com") {
      const u: User = {
        id: "user-driver",
        name: "Driver Intern",
        email,
        role: "driver",
      };
      setUser(u);
      localStorage.setItem("namlo_user", JSON.stringify(u));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("namlo_user");
  };

  const setRole = (r: Role) => {
    if (!user) return;
    const next = { ...user, role: r };
    setUser(next);
    localStorage.setItem("namlo_user", JSON.stringify(next));
  };

  const updateProfile = (changes: Partial<User>) => {
    if (!user) return;
    const next = { ...user, ...changes };
    setUser(next);
    localStorage.setItem("namlo_user", JSON.stringify(next));
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, setRole, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
