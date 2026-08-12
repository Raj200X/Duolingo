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
        <div className="duo-card duo-card-p-md" style={{ marginBottom: "var(--space-6)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <span style={{ fontSize: 32 }}>⚡</span>
          <div style={{ flex: 1 }}>
            <div className="flex justify-between items-center" style={{ marginBottom: "var(--space-2)" }}>
              <span className="text-label text-muted">Daily Goal</span>
              <span className="text-label" style={{ color: "var(--brand-primary)" }}>
                {streak.daily_xp_earned} / {streak.daily_xp_goal} XP
              </span>
            </div>
            <div className="duo-progress-track">
              <div
                className="duo-progress-fill duo-progress-fill-primary"
                style={{ width: `${Math.min(100, streak.daily_xp_progress_pct)}%` }}
              >
                <div className="duo-progress-highlight" />
              </div>
            </div>
          </div>
          {streak.daily_xp_progress_pct >= 100 && (
            <span style={{ fontSize: 24 }} className="animate-pop-in">✅</span>
          )}
        </div>
      )}

      <SkillTree courseId={1} />
    </div>
  );
}
