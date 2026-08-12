"use client";

import { useQuery } from "@tanstack/react-query";
import { getLeaderboard } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import "./Leaderboard.css";

const RANK_COLORS: Record<number, string> = {
  1: "#FFC800", // Gold
  2: "#C8D8E0", // Silver
  3: "#cd7f32", // Bronze
};

export default function LeaderboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard", "weekly"],
    queryFn: getLeaderboard,
  });

  if (isLoading) return <LeaderboardSkeleton />;
  if (!data) return null;

  return (
    <div className="animate-fade-in pb-12">
      <div className="mb-8">
        <h1 className="text-h1">🏆 Leaderboard</h1>
        <div className="text-body mt-2">
          Weekly XP — week of {new Date(data.week_start).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Top 3 podium */}
      {data.entries.length >= 3 && (
        <div className="podium-container">
          <PodiumBlock entry={data.entries[1]} place={2} height={100} />
          <PodiumBlock entry={data.entries[0]} place={1} height={130} />
          <PodiumBlock entry={data.entries[2]} place={3} height={80} />
        </div>
      )}

      {/* Full list */}
      <Card padding="none" className="overflow-hidden">
        {data.entries.map((entry, idx) => (
          <div
            key={entry.user_id}
            className={`leaderboard-row ${entry.is_current_user ? "is-me" : ""}`}
            style={{ borderBottom: idx < data.entries.length - 1 ? "2px solid var(--border-light)" : "none" }}
          >
            {/* Rank badge */}
            <div
              className="rank-badge"
              style={{
                background: RANK_COLORS[entry.rank] ?? "var(--bg-surface)",
                color: entry.rank <= 3 ? "white" : "var(--text-muted)",
              }}
            >
              {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : entry.rank}
            </div>

            {/* Avatar */}
            <div
              className="leaderboard-avatar"
              style={{
                background: `hsl(${(entry.user_id * 60) % 360}, 70%, 60%)`,
              }}
            >
              {entry.display_name.charAt(0)}
            </div>

            {/* Name */}
            <div className="flex-1">
              <div className="text-body-strong">
                {entry.display_name}
                {entry.is_current_user && (
                  <span className="you-badge">YOU</span>
                )}
              </div>
            </div>

            {/* XP */}
            <div className="text-right">
              <div className="text-h3" style={{ color: "var(--status-warning-hover)" }}>
                {entry.xp_this_week.toLocaleString()}
              </div>
              <div className="text-label" style={{ color: "var(--text-disabled)" }}>XP</div>
            </div>
          </div>
        ))}
      </Card>

      {data.entries.length === 0 && (
        <div className="text-center p-10 text-muted text-body-strong">
          No leaderboard data yet. Complete a lesson to appear here!
        </div>
      )}
    </div>
  );
}

interface PodiumEntry {
  display_name: string;
  xp_this_week: number;
  is_current_user: boolean;
  user_id: number;
}

function PodiumBlock({ entry, place, height }: { entry: PodiumEntry; place: number; height: number }) {
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div className="podium-block">
      <div
        className="podium-avatar"
        style={{
          background: `hsl(${(entry.user_id * 60) % 360}, 70%, 60%)`,
          borderColor: RANK_COLORS[place],
          boxShadow: `0 4px 0 ${RANK_COLORS[place]}`,
        }}
      >
        {entry.display_name.charAt(0)}
      </div>
      <div className="podium-name">{entry.display_name}</div>
      <div
        className="podium-pillar"
        style={{
          background: RANK_COLORS[place],
          height,
        }}
      >
        <div style={{ fontSize: 24 }}>{medals[place - 1]}</div>
        <div style={{ fontSize: 15, fontWeight: 900 }}>{entry.xp_this_week}</div>
      </div>
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div style={{ width: 200, height: 32, background: "var(--bg-surface)", borderRadius: 8, marginBottom: 24 }} />
      <Card padding="none">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center p-4 border-b-2" style={{ borderColor: "var(--border-light)", gap: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg-surface)" }} />
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--bg-surface)" }} />
            <div style={{ flex: 1, height: 20, borderRadius: 4, background: "var(--bg-surface)" }} />
            <div style={{ width: 60, height: 20, borderRadius: 4, background: "var(--bg-surface)" }} />
          </div>
        ))}
      </Card>
    </div>
  );
}
