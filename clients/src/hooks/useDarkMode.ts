import { useEffect, useState } from "react";

const STORAGE_KEY = "namlo_dark_mode";

export function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dark));
    } catch {}

    if (typeof document !== "undefined") {
      if (dark) document.documentElement.classList.add("nm-dark");
      else document.documentElement.classList.remove("nm-dark");
    }
  }, [dark]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        try {
          setDark(e.newValue ? JSON.parse(e.newValue) : false);
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return [dark, setDark] as const;
}
