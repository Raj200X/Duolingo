"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LearnIcon, LeaderboardIcon, QuestsIcon, ShopIcon, ProfileIcon, MoreIcon, CharactersIcon } from "./SidebarIcons";
import ChameleonMascot from "@/components/ui/ChameleonMascot";
import "./Sidebar.css";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/learn", label: "LEARN", icon: LearnIcon },
    { href: "/characters", label: "CHARACTERS", icon: CharactersIcon },
    { href: "/leaderboard", label: "LEADERBOARD", icon: LeaderboardIcon },
    { href: "/quests", label: "QUESTS", icon: QuestsIcon },
    { href: "/shop", label: "SHOP", icon: ShopIcon },
    { href: "/profile", label: "PROFILE", icon: ProfileIcon },
    { href: "/more", label: "MORE", icon: MoreIcon },
  ];

  return (
    <nav className="sidebar">
      {/* Brand Logo (Desktop Only) */}
      <div className="sidebar-brand">
        <span className="brand-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChameleonMascot state="idle" size={48} />
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
                <Icon active={isActive} />
              </div>
              <span className="nav-label">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
