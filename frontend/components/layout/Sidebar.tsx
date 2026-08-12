"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Trophy, User, Flame, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/api";

export function Sidebar() {
  const pathname = usePathname();
  const { data: user } = useQuery({ queryKey: ["user", "me"], queryFn: getMe });

  const navItems = [
    { href: "/learn", label: "LEARN", icon: BookOpen },
    { href: "/leaderboard", label: "LEADERBOARD", icon: Trophy },
    { href: "/profile", label: "PROFILE", icon: User },
  ];

  return (
    <nav className="sidebar">
      {/* Logo */}
      <div style={{ padding: "0 24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 36 }}>🦜</span>
          <span style={{ fontWeight: 900, fontSize: 22, color: "var(--duo-green)", letterSpacing: "-0.5px" }}>
            duolingo
          </span>
        </div>
      </div>

      {/* Nav links */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href === "/learn" && pathname === "/");
          return (
            <Link
              key={href}
              href={href}
              className={`nav-item${isActive ? " active" : ""}`}
            >
              <Icon size={24} strokeWidth={2.5} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* User streak card at bottom */}
      {user && (
        <div
          style={{
            margin: "32px 16px 0",
            padding: "16px",
            border: "2px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            background: "var(--bg-secondary)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24 }}>🔥</div>
              <div style={{ fontWeight: 900, fontSize: 18, color: "var(--duo-orange)" }}>
                {user.streak_count}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Day Streak
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24 }}>⚡</div>
              <div style={{ fontWeight: 900, fontSize: 18, color: "var(--duo-yellow)" }}>
                {user.xp_total}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Total XP
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24 }}>❤️</div>
              <div style={{ fontWeight: 900, fontSize: 18, color: "var(--duo-red)" }}>
                {user.hearts}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Hearts
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
