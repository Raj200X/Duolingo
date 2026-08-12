"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyStats } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import "./Profile.css";

import ChameleonMascot from "@/components/ui/ChameleonMascot";

export default function ProfilePage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["user", "stats"],
    queryFn: getMyStats,
  });

  if (isLoading) return <ProfileSkeleton />;
  if (!stats) return null;

  return (
    <div className="animate-fade-in pb-12">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar-container">
          <div className="profile-avatar" style={{ overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "flex-end", backgroundColor: "var(--bg-surface)" }}>
            <ChameleonMascot state="idle" size={96} />
          </div>
        </div>
        <h1 className="text-h1">{stats.user.display_name}</h1>
        <div className="text-body mt-1">@{stats.user.username}</div>
        
        <div className="flex justify-center mt-6">
          <ThemeSwitcher />
        </div>
      </div>

      {/* Stats grid */}
      <div className="stats-grid mt-8">
        <StatCard icon="🔥" value={stats.streak_count} label="Day Streak" color="var(--status-warning)" />
        <StatCard icon="⚡" value={stats.total_xp} label="Total XP" color="var(--color-secondary)" />
        <StatCard icon="❤️" value={stats.hearts} label="Hearts" color="var(--status-error)" />
        <StatCard icon="💎" value={stats.user.gems} label="Gems" color="var(--color-primary)" />
        <StatCard icon="⭐" value={stats.total_skills_completed} label="Skills Done" color="var(--status-success)" />
        <StatCard icon="📚" value={stats.total_lessons_completed} label="Lessons Done" color="var(--color-primary-hover)" />
      </div>

      {/* Daily goal */}
      <Card className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <div className="text-h3">⚡ Today&apos;s Goal</div>
          <div className="text-label" style={{ color: "var(--color-secondary)" }}>
            {stats.daily_xp_earned} / {stats.daily_xp_goal} XP
          </div>
        </div>
        <ProgressBar progress={(stats.daily_xp_earned / stats.daily_xp_goal) * 100} color="warning" />
      </Card>

      {/* Achievements placeholder */}
      <div className="mt-12">
        <h2 className="text-h2 mb-4">🏅 Achievements</h2>
        <div className="achievements-grid">
          {ACHIEVEMENTS.map((a) => (
            <Card 
              key={a.id} 
              padding="md" 
              className="text-center"
              style={{ opacity: a.unlocked(stats) ? 1 : 0.5, filter: a.unlocked(stats) ? "none" : "grayscale(0.8)" }}
            >
              <div style={{ fontSize: 40, marginBottom: "var(--space-2)" }}>{a.icon}</div>
              <div className="text-label text-muted">{a.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color }: { icon: string; value: number; label: string; color: string }) {
  return (
    <Card padding="md" className="stat-card">
      <div style={{ fontSize: 32, marginBottom: "var(--space-2)" }}>{icon}</div>
      <div className="text-h2" style={{ color }}>{value}</div>
      <div className="text-label text-muted mt-1">{label}</div>
    </Card>
  );
}

// Same logic as before
const ACHIEVEMENTS = [
  { id: 1, icon: "🔥", label: "3-Day Streak", unlocked: (s: any) => s.streak_count >= 3 },
  { id: 2, icon: "⭐", label: "First Skill", unlocked: (s: any) => s.total_skills_completed >= 1 },
  { id: 3, icon: "📚", label: "5 Lessons", unlocked: (s: any) => s.total_lessons_completed >= 5 },
  { id: 4, icon: "💯", label: "100 XP", unlocked: (s: any) => s.total_xp >= 100 },
  { id: 5, icon: "🌟", label: "3 Skills", unlocked: (s: any) => s.total_skills_completed >= 3 },
  { id: 6, icon: "🏆", label: "500 XP", unlocked: (s: any) => s.total_xp >= 500 },
];

function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="profile-header">
        <div className="profile-avatar-container">
          <div className="profile-avatar" style={{ background: "var(--bg-surface)" }} />
        </div>
        <div style={{ width: 160, height: 32, background: "var(--bg-surface)", borderRadius: 8, margin: "0 auto var(--space-2)" }} />
        <div style={{ width: 100, height: 20, background: "var(--bg-surface)", borderRadius: 8, margin: "0 auto" }} />
      </div>
      <div className="stats-grid mt-8">
        {[...Array(6)].map((_, i) => (
          <Card key={i} padding="md" className="stat-card">
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bg-surface)", margin: "0 auto var(--space-2)" }} />
            <div style={{ width: 60, height: 24, borderRadius: 4, background: "var(--bg-surface)", margin: "0 auto var(--space-1)" }} />
            <div style={{ width: 80, height: 16, borderRadius: 4, background: "var(--bg-surface)", margin: "0 auto" }} />
          </Card>
        ))}
      </div>
    </div>
  );
}
