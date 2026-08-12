"use client";

import { useQuery } from "@tanstack/react-query";
import { getSkillTree } from "@/lib/api";
import { SkillNode } from "./SkillNode";
import { UnitBanner } from "./UnitBanner";
import type { Skill, Unit } from "@/types";
import ChameleonMascot from "@/components/ui/ChameleonMascot";
import "./SkillTree.css";

// Zigzag offset pattern for visual path
const ZIGZAG_OFFSETS = [0, 60, 100, 60, 0, -60, -100, -60];

interface SkillTreeProps {
  courseId: number;
}

export function SkillTree({ courseId }: SkillTreeProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["courses", courseId, "skill-tree"],
    queryFn: () => getSkillTree(courseId),
  });

  if (isLoading) return <SkillTreeSkeleton />;
  if (error || !data) return (
    <div className="flex flex-col items-center justify-center p-10 text-muted">
      <div style={{ fontSize: 48, marginBottom: 16 }}>😢</div>
      <div className="text-h3">Failed to load skill tree.</div>
    </div>
  );

  return (
    <div className="skill-tree-container animate-fade-in">
      {/* Course header */}
      <div className="course-header text-center" style={{ marginBottom: "var(--space-8)" }}>
        <div style={{ fontSize: 64, animation: "popIn 0.5s ease" }}>{data.course.flag_emoji}</div>
        <h1 className="text-h1" style={{ color: "var(--text-main)", marginTop: "var(--space-2)" }}>
          {data.course.name}
        </h1>
        <p className="text-body" style={{ marginTop: "var(--space-2)" }}>
          {data.course.description}
        </p>
      </div>

      {data.units.map((unit, unitIndex) => {
        return (
          <div key={unit.id} className="unit-section">
            <UnitBanner unit={unit} index={unitIndex} />

            <div className="skill-path-container">
              {unit.skills.map((skill, skillIndex) => {
                const offset = ZIGZAG_OFFSETS[skillIndex % ZIGZAG_OFFSETS.length];
                const firstLessonId = getFirstLessonId(skill, data.units, unitIndex, skillIndex);

                return (
                  <div
                    key={skill.id}
                    className="skill-path-node-wrapper"
                    style={{
                      transform: `translateX(${offset}px)`,
                      zIndex: 1, // Above the SVG path
                    }}
                  >
                    <SkillNode
                      skill={skill}
                      unitColor={unit.color_hex}
                      firstLessonId={firstLessonId}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Bottom mascot */}
      <div className="text-center p-10 text-muted flex flex-col items-center">
        <ChameleonMascot state="sleepy" size={120} />
        <div className="text-h3" style={{ marginTop: "var(--space-4)" }}>You've reached the end!</div>
        <div className="text-body" style={{ marginTop: "var(--space-2)" }}>Practice completed skills to earn more XP</div>
      </div>
    </div>
  );
}

function getFirstLessonId(skill: Skill, _units: Unit[], _unitIndex: number, _skillIndex: number): number {
  return skill.id;
}

function SkillTreeSkeleton() {
  return (
    <div className="skill-tree-container">
      {[1, 2, 3].map((u) => (
        <div key={u} className="unit-section">
          <div className="skeleton-banner" />
          <div className="skill-path-container">
            {[1, 2, 3].map((s) => (
              <div key={s} className="skill-path-node-wrapper">
                <div className="skeleton-node-circle" />
                <div className="skeleton-node-text" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
