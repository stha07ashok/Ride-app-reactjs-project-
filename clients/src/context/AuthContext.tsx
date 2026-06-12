import React, { createContext, useContext, useState, useCallback } from "react";
import { ref, set, serverTimestamp } from "firebase/database";
import { db } from "../services/firebase";
import type { Role } from "../types/types";

export type User = {
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

function syncUserToFirestore(u: User) {
  const userRef = ref(db, "users/" + u.id);
  set(userRef, {
    email: u.email,
    name: u.name ?? "",
    role: u.role,
    updatedAt: serverTimestamp(),
  });
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("namlo_user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = useCallback(async (email: string, password: string) => {
    if (password !== "namlo2026") return false;

    let u: User | null = null;

    if (email === "intern@namlotech.com") {
      u = {
        id: "user-intern",
        name: "Intern Evaluator",
        email,
        role: "rider",
      };
    } else if (email === "intern@namlotechrider.com") {
      u = {
        id: "user-rider",
        name: "Rider Intern",
        email,
        role: "rider",
      };
    } else if (email === "intern@namlotechdriver.com") {
      u = {
        id: "user-driver",
        name: "Driver Intern",
        email,
        role: "driver",
      };
    }

    if (!u) return false;

    setUser(u);
    localStorage.setItem("namlo_user", JSON.stringify(u));
    syncUserToFirestore(u);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("namlo_user");
  }, []);

  const setRole = useCallback((r: Role) => {
    if (!user) return;
    const next = { ...user, role: r };
    setUser(next);
    localStorage.setItem("namlo_user", JSON.stringify(next));
    syncUserToFirestore(next);
  }, [user]);

  const updateProfile = useCallback((changes: Partial<User>) => {
    if (!user) return;
    const next = { ...user, ...changes };
    setUser(next);
    localStorage.setItem("namlo_user", JSON.stringify(next));
    syncUserToFirestore(next);
  }, [user]);

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
