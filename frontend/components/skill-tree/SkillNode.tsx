"use client";

import { useRouter } from "next/navigation";
import type { Skill } from "@/types";
import { Star, Lock, Crown } from "lucide-react";
import "./SkillNode.css";

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
  const isCompleted = skill.state === "completed";
  const isLocked = skill.state === "locked";
  const isActive = skill.state === "in_progress" || skill.state === "available";

  // Compute Colors
  const bgColor = isCompleted ? "var(--status-warning)" : isActive ? unitColor : "var(--status-locked)";
  // Determine icon
  let IconElement = <span className="skill-emoji">{skill.icon || "⭐"}</span>;
  if (isLocked) {
    IconElement = <Lock size={32} className="skill-icon-locked" strokeWidth={2.5} />;
  } else if (isCompleted) {
    IconElement = <Star size={36} fill="white" color="white" strokeWidth={2} />;
  }

  return (
    <div 
      className={`skill-node-wrapper ${skill.state}`} 
      onClick={handleClick}
      title={isLocked ? "Complete previous skill to unlock" : skill.title}
    >
      
      {/* Floating Crown Badge */}
      {!isLocked && crowns > 0 && (
        <div className="skill-crown-badge">
          <Crown size={14} fill="var(--status-warning)" color="var(--status-warning-hover)" />
          <span>{crowns}</span>
        </div>
      )}

      {/* Main Node */}
      <div 
        className="skill-node-circle"
        style={{ 
          "--node-color": bgColor,
          "--node-shadow": isLocked ? "var(--border-strong)" : `color-mix(in srgb, ${bgColor} 70%, black)`
        } as React.CSSProperties}
      >
        <div className="skill-node-content">
          {IconElement}
        </div>
      </div>
      
      <div className="skill-node-title">{skill.title}</div>
    </div>
  );
}
