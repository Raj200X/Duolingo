"use client";

import { useQuery } from "@tanstack/react-query";
import { getLeaderboard } from "@/lib/api";

const RANK_COLORS: Record<number, string> = {
  1: "#ffd700",
  2: "#c0c0c0",
  3: "#cd7f32",
};

export default function LeaderboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard", "weekly"],
    queryFn: getLeaderboard,
  });

  if (isLoading) return <LeaderboardSkeleton />;
  if (!data) return null;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)", marginBottom: 4 }}>
          🏆 Leaderboard
        </h1>
        <div style={{ color: "var(--text-secondary)", fontWeight: 600, fontSize: 14 }}>
          Weekly XP — week of {new Date(data.week_start).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Top 3 podium */}
      {data.entries.length >= 3 && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 12,
            marginBottom: 32,
            padding: "0 16px",
          }}
        >
          <PodiumBlock entry={data.entries[1]} place={2} height={100} />
          <PodiumBlock entry={data.entries[0]} place={1} height={130} />
          <PodiumBlock entry={data.entries[2]} place={3} height={80} />
        </div>
      )}

      {/* Full list */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "2px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        {data.entries.map((entry, idx) => (
          <div
            key={entry.user_id}
            className={`leaderboard-row${entry.is_current_user ? " is-me" : ""}`}
            style={{ borderBottom: idx < data.entries.length - 1 ? "1px solid var(--border)" : "none" }}
          >
            {/* Rank badge */}
            <div
              className="rank-badge"
              style={{
                background: RANK_COLORS[entry.rank] ?? "var(--bg-secondary)",
                color: entry.rank <= 3 ? "#333" : "var(--text-secondary)",
              }}
            >
              {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : entry.rank}
            </div>

            {/* Avatar */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: `hsl(${(entry.user_id * 60) % 360}, 70%, 60%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 800,
                color: "white",
                flexShrink: 0,
              }}
            >
              {entry.display_name.charAt(0)}
            </div>

            {/* Name */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: "var(--text-primary)" }}>
                {entry.display_name}
                {entry.is_current_user && (
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--duo-green)",
                      background: "#d7ffb8",
                      padding: "2px 8px",
                      borderRadius: "var(--radius-full)",
                    }}
                  >
                    YOU
                  </span>
                )}
              </div>
            </div>

            {/* XP */}
            <div style={{ fontWeight: 900, fontSize: 16, color: "var(--duo-yellow)", textAlign: "right" }}>
              {entry.xp_this_week.toLocaleString()}
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>XP</div>
            </div>
          </div>
        ))}
      </div>

      {data.entries.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)", fontWeight: 600 }}>
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: `hsl(${(entry.user_id * 60) % 360}, 70%, 60%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          fontWeight: 900,
          color: "white",
          marginBottom: 8,
          border: `3px solid ${RANK_COLORS[place]}`,
          boxShadow: `0 4px 0 ${RANK_COLORS[place]}`,
        }}
      >
        {entry.display_name.charAt(0)}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 4, textAlign: "center" }}>
        {entry.display_name}
      </div>
      <div
        style={{
          background: RANK_COLORS[place],
          width: "100%",
          height,
          borderRadius: "var(--radius-md) var(--radius-md) 0 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#333",
          fontWeight: 900,
        }}
      >
        <div style={{ fontSize: 20 }}>{medals[place - 1]}</div>
        <div style={{ fontSize: 14 }}>{entry.xp_this_week}</div>
      </div>
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div>
      <div style={{ width: 200, height: 32, background: "var(--bg-secondary)", borderRadius: 8, marginBottom: 24, animation: "pulse 1.5s infinite" }} />
      <div style={{ background: "var(--bg-card)", border: "2px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ display: "flex", gap: 16, padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg-secondary)", animation: "pulse 1.5s infinite" }} />
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--bg-secondary)", animation: "pulse 1.5s infinite" }} />
            <div style={{ flex: 1, height: 20, borderRadius: 4, background: "var(--bg-secondary)", animation: "pulse 1.5s infinite" }} />
            <div style={{ width: 60, height: 20, borderRadius: 4, background: "var(--bg-secondary)", animation: "pulse 1.5s infinite" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
