"use client";

import { useTheme } from "./ThemeProvider";
import { Moon, Sun, Monitor } from "lucide-react";
import "./ThemeSwitcher.css";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-switcher">
      <button 
        className={`theme-btn ${theme === "light" ? "active" : ""}`}
        onClick={() => setTheme("light")}
        title="Light Mode"
      >
        <Sun size={20} strokeWidth={2.5} />
        <span>Light</span>
      </button>
      <button 
        className={`theme-btn ${theme === "system" ? "active" : ""}`}
        onClick={() => setTheme("system")}
        title="System Preference"
      >
        <Monitor size={20} strokeWidth={2.5} />
        <span>System</span>
      </button>
      <button 
        className={`theme-btn ${theme === "dark" ? "active" : ""}`}
        onClick={() => setTheme("dark")}
        title="Dark Mode"
      >
        <Moon size={20} strokeWidth={2.5} />
        <span>Dark</span>
      </button>
    </div>
  );
}
