"use client";

import { SkillTree } from "@/components/skill-tree/SkillTree";
import { useQuery } from "@tanstack/react-query";
import { getMe, getStreak } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function LearnPage() {
  const { data: user } = useQuery({ queryKey: ["user", "me"], queryFn: getMe });
  const { data: streak } = useQuery({ queryKey: ["streak"], queryFn: getStreak });

  return (
    <div>
      {/* Daily XP progress bar */}
      {streak && user && (
        <Card padding="md" style={{ marginBottom: "var(--space-6)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <span style={{ fontSize: 32 }}>⚡</span>
          <div style={{ flex: 1 }}>
            <div className="flex justify-between items-center" style={{ marginBottom: "var(--space-2)" }}>
              <span className="text-label text-muted">DAILY GOAL</span>
              <span className="text-label" style={{ color: "var(--brand-primary)" }}>
                {streak.daily_xp_earned} / {streak.daily_xp_goal} XP
              </span>
            </div>
            <ProgressBar progress={streak.daily_xp_progress_pct} color="warning" />
          </div>
          {streak.daily_xp_progress_pct >= 100 && (
            <span style={{ fontSize: 24 }} className="animate-pop-in">✅</span>
          )}
        </Card>
      )}

      <SkillTree courseId={1} />
    </div>
  );
}
