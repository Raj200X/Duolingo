"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { LessonCompleteResponse } from "@/types";

interface LessonCompleteModalProps {
  result: LessonCompleteResponse;
  onClose: () => void;
}

export function LessonCompleteModal({ result, onClose }: LessonCompleteModalProps) {
  const router = useRouter();
  const hasLaunched = useRef(false);

  useEffect(() => {
    if (hasLaunched.current) return;
    hasLaunched.current = true;

    // Web Speech API celebration
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance("Excellent! Lesson complete!");
      utterance.lang = "en-US";
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }

    // Simple confetti using CSS animation (canvas-confetti would need dynamic import)
    launchConfetti();
  }, []);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card animate-pop">
        {/* Mascot */}
        <div style={{ fontSize: 80, marginBottom: 8 }}>🦜</div>

        <div className="modal-title" style={{ color: "var(--duo-green-dark)" }}>
          Lesson Complete!
        </div>
        <div className="modal-subtitle">You&apos;re on a roll!</div>

        {/* XP Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            margin: "24px 0",
          }}
        >
          <StatChip
            icon="⚡"
            value={`+${result.xp_earned + result.bonus_xp}`}
            label="XP"
            color="var(--duo-yellow)"
          />
          <StatChip
            icon="🔥"
            value={String(result.streak_count)}
            label="Streak"
            color="var(--duo-orange)"
          />
          <StatChip
            icon="❤️"
            value={String(result.hearts_remaining)}
            label="Hearts"
            color="var(--duo-red)"
          />
        </div>

        {result.bonus_xp > 0 && (
          <div
            style={{
              background: "#d7ffb8",
              borderRadius: "var(--radius-md)",
              padding: "10px 16px",
              marginBottom: 16,
              fontWeight: 700,
              color: "var(--duo-green-dark)",
              fontSize: 14,
            }}
          >
            🎯 Perfect lesson bonus: +{result.bonus_xp} XP!
          </div>
        )}

        {result.skill_completed && (
          <div
            style={{
              background: "#fff4cc",
              borderRadius: "var(--radius-md)",
              padding: "10px 16px",
              marginBottom: 16,
              fontWeight: 700,
              color: "#8a6500",
              fontSize: 14,
            }}
          >
            ⭐ Skill completed! You earned a crown!
          </div>
        )}

        <button
          className="btn btn-primary"
          style={{ width: "100%", marginTop: 8 }}
          onClick={() => { onClose(); router.push("/learn"); }}
          id="lesson-complete-continue"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function StatChip({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        borderRadius: "var(--radius-md)",
        padding: "12px 8px",
        textAlign: "center",
        border: "2px solid var(--border)",
      }}
    >
      <div style={{ fontSize: 24 }}>{icon}</div>
      <div style={{ fontWeight: 900, fontSize: 22, color }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
        {label}
      </div>
    </div>
  );
}

function launchConfetti() {
  // Pure CSS/emoji confetti burst
  const container = document.createElement("div");
  container.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 200; overflow: hidden;
  `;
  document.body.appendChild(container);

  const emojis = ["🎉", "⭐", "✨", "🎊", "💫", "🌟"];
  for (let i = 0; i < 40; i++) {
    const el = document.createElement("div");
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    el.textContent = emoji;
    el.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      top: -40px;
      font-size: ${16 + Math.random() * 20}px;
      animation: confettiFall ${1.5 + Math.random() * 2}s ease-in forwards;
      animation-delay: ${Math.random() * 0.8}s;
    `;
    container.appendChild(el);
  }

  // Add animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes confettiFall {
      to {
        transform: translateY(100vh) rotate(${Math.random() > 0.5 ? "" : "-"}${360 + Math.random() * 360}deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  setTimeout(() => {
    container.remove();
    style.remove();
  }, 4000);
}
