"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyStats } from "@/lib/api";

export default function ProfilePage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["user", "stats"],
    queryFn: getMyStats,
  });

  if (isLoading) return <ProfileSkeleton />;
  if (!stats) return null;

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--duo-green), var(--duo-blue))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            margin: "0 auto 16px",
            border: "4px solid white",
            boxShadow: "0 4px 0 var(--duo-green-dark)",
          }}
        >
          🦜
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)" }}>
          {stats.user.display_name}
        </h1>
        <div style={{ color: "var(--text-secondary)", fontWeight: 600, marginTop: 4 }}>
          @{stats.user.username}
        </div>
      </div>

      {/* Stats grid */}
      <div className="stats-grid">
        <StatCard icon="🔥" value={stats.streak_count} label="Day Streak" color="var(--duo-orange)" />
        <StatCard icon="⚡" value={stats.total_xp} label="Total XP" color="var(--duo-yellow)" />
        <StatCard icon="❤️" value={stats.hearts} label="Hearts" color="var(--duo-red)" />
        <StatCard icon="💎" value={stats.user.gems} label="Gems" color="var(--duo-blue)" />
        <StatCard icon="⭐" value={stats.total_skills_completed} label="Skills Done" color="var(--duo-green)" />
        <StatCard icon="📚" value={stats.total_lessons_completed} label="Lessons Done" color="var(--duo-purple)" />
      </div>

      {/* Daily goal */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "2px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: 20,
          marginTop: 8,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>⚡ Today&apos;s Goal</div>
          <div style={{ fontWeight: 700, color: "var(--duo-green)", fontSize: 15 }}>
            {stats.daily_xp_earned} / {stats.daily_xp_goal} XP
          </div>
        </div>
        <div className="xp-bar-track">
          <div
            className="xp-bar-fill"
            style={{ width: `${Math.min(100, (stats.daily_xp_earned / stats.daily_xp_goal) * 100)}%` }}
          />
        </div>
      </div>

      {/* Achievements placeholder */}
      <div style={{ marginTop: 24 }}>
        <h2 style={{ fontWeight: 800, fontSize: 18, marginBottom: 16 }}>🏅 Achievements</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {ACHIEVEMENTS.map((a) => (
            <div
              key={a.id}
              style={{
                background: "var(--bg-card)",
                border: "2px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: 16,
                textAlign: "center",
                opacity: a.unlocked(stats) ? 1 : 0.4,
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 6 }}>{a.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 12, color: "var(--text-primary)" }}>{a.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color }: { icon: string; value: number; label: string; color: string }) {
  return (
    <div className="stat-card">
      <div style={{ fontSize: 28, marginBottom: 4 }}>{icon}</div>
      <div className="stat-card-value" style={{ color }}>{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}

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
    <div>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ width: 96, height: 96, borderRadius: "50%", background: "var(--bg-secondary)", margin: "0 auto 16px", animation: "pulse 1.5s infinite" }} />
        <div style={{ width: 140, height: 24, borderRadius: 8, background: "var(--bg-secondary)", margin: "0 auto", animation: "pulse 1.5s infinite" }} />
      </div>
      <div className="stats-grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="stat-card" style={{ animation: "pulse 1.5s infinite" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bg-secondary)", margin: "0 auto 8px" }} />
            <div style={{ width: 60, height: 20, borderRadius: 4, background: "var(--bg-secondary)", margin: "0 auto 4px" }} />
            <div style={{ width: 80, height: 12, borderRadius: 4, background: "var(--bg-secondary)", margin: "0 auto" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
