"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Trophy, User, Home, Shield } from "lucide-react";
import ChameleonMascot from "@/components/ui/ChameleonMascot";
import "./Sidebar.css";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/learn", label: "LEARN", icon: Home },
    { href: "/leaderboard", label: "LEADERBOARD", icon: Shield },
    { href: "/profile", label: "PROFILE", icon: User },
  ];

  return (
    <nav className="sidebar">
      {/* Brand Logo (Desktop Only) */}
      <div className="sidebar-brand">
        <span className="brand-logo" style={{ width: 40, height: 40, overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <ChameleonMascot state="peeking" size={56} />
        </span>
        <span className="brand-text">chamelo</span>
      </div>

      {/* Nav Links */}
      <div className="sidebar-links">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href === "/learn" && pathname === "/");
          return (
            <Link
              key={href}
              href={href}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <div className="nav-icon-container">
                <Icon size={28} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="nav-label">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
