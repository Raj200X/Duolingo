"use client";

import { SkillTree } from "@/components/skill-tree/SkillTree";
import { useQuery } from "@tanstack/react-query";
import { getMe, getStreak } from "@/lib/api";

export default function LearnPage() {
  const { data: user } = useQuery({ queryKey: ["user", "me"], queryFn: getMe });
  const { data: streak } = useQuery({ queryKey: ["streak"], queryFn: getStreak });

  return (
    <div>
      {/* Daily XP progress bar */}
      {streak && user && (
        <div
          style={{
            background: "var(--bg-card)",
            border: "2px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "16px 20px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 28 }}>⚡</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontWeight: 800, fontSize: 14, color: "var(--text-secondary)" }}>
                Daily Goal
              </span>
              <span style={{ fontWeight: 800, fontSize: 14, color: "var(--duo-green)" }}>
                {streak.daily_xp_earned} / {streak.daily_xp_goal} XP
              </span>
            </div>
            <div className="xp-bar-track">
              <div
                className="xp-bar-fill"
                style={{ width: `${Math.min(100, streak.daily_xp_progress_pct)}%` }}
              />
            </div>
          </div>
          {streak.daily_xp_progress_pct >= 100 && (
            <span style={{ fontSize: 24 }}>✅</span>
          )}
        </div>
      )}

      <SkillTree courseId={1} />
    </div>
  );
}
