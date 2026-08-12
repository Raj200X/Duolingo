"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    // Sync with localStorage on mount
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setThemeState(stored);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (theme === "system") {
      localStorage.removeItem("theme");
      if (isSystemDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    } else {
      localStorage.setItem("theme", theme);
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme]);

  // Listen to system changes if theme is 'system'
  useEffect(() => {
    if (theme !== "system") return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const root = window.document.documentElement;
      if (e.matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
