"use client";

import { useRouter } from "next/navigation";
import type { Skill } from "@/types";

interface SkillNodeProps {
  skill: Skill;
  unitColor: string;
  firstLessonId?: number;
}

export function SkillNode({ skill, unitColor, firstLessonId }: SkillNodeProps) {
  const router = useRouter();
  const isClickable = skill.state !== "locked";

  function handleClick() {
    if (!isClickable || !firstLessonId) return;
    router.push(`/lesson/${firstLessonId}`);
  }

  const crowns = skill.progress?.crowns ?? 0;
  const totalDots = skill.total_lessons;

  // Choose circle color based on state
  const circleColor =
    skill.state === "completed"
      ? "var(--duo-yellow)"
      : skill.state === "in_progress"
      ? unitColor
      : skill.state === "available"
      ? unitColor
      : "var(--bg-secondary)";

  const borderColor =
    skill.state === "completed"
      ? "var(--duo-yellow-dark)"
      : skill.state === "available" || skill.state === "in_progress"
      ? `color-mix(in srgb, ${unitColor} 70%, black)`
      : "var(--border-dark)";

  return (
    <div className="skill-node" onClick={handleClick} style={{ cursor: isClickable ? "pointer" : "not-allowed" }}>
      <div
        className={`skill-circle ${skill.state}`}
        style={{
          background: circleColor,
          borderColor: borderColor,
          boxShadow: isClickable ? `0 5px 0 ${borderColor}` : `0 4px 0 var(--border-dark)`,
        }}
        title={skill.state === "locked" ? "Complete previous skill to unlock" : skill.title}
      >
        {skill.state === "locked" ? (
          <span style={{ fontSize: 28, opacity: 0.4 }}>🔒</span>
        ) : (
          <span style={{ fontSize: 30 }}>{skill.icon || "⭐"}</span>
        )}

        {/* Star badge for completed */}
        {skill.state === "completed" && (
          <div
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "var(--duo-yellow)",
              border: "2px solid white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
            }}
          >
            ⭐
          </div>
        )}
      </div>

      <div className="skill-title">{skill.title}</div>

      {/* Crown progress dots */}
      {skill.state !== "locked" && (
        <div className="crown-dots">
          {Array.from({ length: totalDots }).map((_, i) => (
            <div
              key={i}
              className={`crown-dot${i < crowns ? " filled" : ""}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
