"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { LessonCompleteResponse } from "@/types";
import { Button } from "@/components/ui/Button";
import ChameleonMascot from "@/components/ui/ChameleonMascot";
import "./Modals.css";

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

    launchConfetti();
  }, []);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        {/* Mascot */}
        <div style={{ marginBottom: "var(--space-2)", display: "flex", justifyContent: "center" }}>
          <ChameleonMascot state="celebrating" size={120} />
        </div>

        <div className="modal-title" style={{ color: "var(--color-primary)" }}>
          Lesson Complete!
        </div>
        <div className="modal-subtitle">You&apos;re on a roll!</div>

        {/* XP Stats */}
        <div className="flex justify-between gap-4" style={{ margin: "var(--space-6) 0" }}>
          <StatChip
            icon="⚡"
            value={`+${result.xp_earned + result.bonus_xp}`}
            label="XP"
            color="var(--color-secondary)"
          />
          <StatChip
            icon="🔥"
            value={String(result.streak_count)}
            label="Streak"
            color="var(--status-warning)"
          />
          <StatChip
            icon="❤️"
            value={String(result.hearts_remaining)}
            label="Hearts"
            color="var(--status-error)"
          />
        </div>

        {result.bonus_xp > 0 && (
          <div
            style={{
              background: "var(--color-primary-light)",
              borderRadius: "var(--radius-md)",
              padding: "12px 16px",
              marginBottom: "var(--space-4)",
              fontWeight: 700,
              color: "var(--color-primary-hover)",
              fontSize: 15,
            }}
          >
            🎯 Perfect lesson bonus: +{result.bonus_xp} XP!
          </div>
        )}

        {result.skill_completed && (
          <div
            style={{
              background: "var(--status-warning-light)",
              borderRadius: "var(--radius-md)",
              padding: "12px 16px",
              marginBottom: "var(--space-4)",
              fontWeight: 700,
              color: "var(--status-warning-hover)",
              fontSize: 15,
            }}
          >
            ⭐ Skill completed! You earned a crown!
          </div>
        )}

        <Button
          variant="primary"
          style={{ width: "100%", marginTop: "var(--space-2)" }}
          onClick={() => { onClose(); router.push("/learn"); }}
          id="lesson-complete-continue"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

function StatChip({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const targetNumber = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
  const prefix = value.startsWith("+") ? "+" : "";

  useEffect(() => {
    let start = 0;
    const duration = 1500; // 1.5 seconds
    const interval = 30; // 30ms updates
    const steps = duration / interval;
    const increment = targetNumber / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetNumber) {
        setDisplayValue(targetNumber);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [targetNumber]);

  return (
    <div
      style={{
        flex: 1,
        background: "var(--bg-surface)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-4) var(--space-2)",
        textAlign: "center",
        border: "2px solid var(--border-light)",
      }}
    >
      <div style={{ fontSize: 28 }}>{icon}</div>
      <div style={{ fontWeight: 900, fontSize: 24, color, margin: "4px 0" }}>
        {prefix}{displayValue}
      </div>
      <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
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
