import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe, getSkillTree } from "@/lib/api";
import "./TopStatBar.css";

export function TopStatBar() {
  const { data: user } = useQuery({ queryKey: ["user", "me"], queryFn: getMe });
  // hardcoding courseId 1 for now since the app focuses on a single course
  const { data: tree } = useQuery({ queryKey: ["courses", 1, "skill-tree"], queryFn: () => getSkillTree(1) });

  if (!user) return <div className="top-stat-bar placeholder" />;

  return (
    <div className="top-stat-bar animate-fade-in">
      <div className="stat-pill stat-flag">
        <span className="stat-icon" style={{ fontSize: 24 }}>{tree?.course?.flag_emoji || "🇪🇸"}</span>
      </div>
      <div className="stat-pill stat-streak">
        <span className="stat-icon">🔥</span>
        <span className="stat-value">{user.streak_count}</span>
      </div>
      <div className="stat-pill stat-gems">
        <span className="stat-icon">💎</span>
        <span className="stat-value">{user.gems || 0}</span>
      </div>
      <div className="stat-pill stat-hearts">
        <span className="stat-icon">❤️</span>
        <span className="stat-value">{user.hearts}</span>
      </div>
    </div>
  );
}
