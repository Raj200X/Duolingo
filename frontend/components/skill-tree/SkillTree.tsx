"use client";

import { useQuery } from "@tanstack/react-query";
import { getSkillTree } from "@/lib/api";
import { SkillNode } from "./SkillNode";
import { UnitBanner } from "./UnitBanner";
import type { Skill, Unit } from "@/types";

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
    <div style={{ textAlign: "center", padding: 40, color: "var(--text-secondary)" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>😢</div>
      <div style={{ fontWeight: 700 }}>Failed to load skill tree. Is the backend running?</div>
    </div>
  );

  return (
    <div className="skill-tree">
      {/* Course header */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 48 }}>{data.course.flag_emoji}</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)" }}>
          {data.course.name}
        </h1>
        <p style={{ color: "var(--text-secondary)", fontWeight: 600, marginTop: 4 }}>
          {data.course.description}
        </p>
      </div>

      {data.units.map((unit, unitIndex) => {
        // Find first lesson id for each skill (for navigation)
        return (
          <div key={unit.id}>
            <UnitBanner unit={unit} index={unitIndex} />

            <div className="skill-path">
              {unit.skills.map((skill, skillIndex) => {
                const offset = ZIGZAG_OFFSETS[skillIndex % ZIGZAG_OFFSETS.length];
                // We'll load first lesson lazily — use skill id as proxy for lesson id
                // The lesson IDs start at 1 and are in order in our seed
                const firstLessonId = getFirstLessonId(skill, data.units, unitIndex, skillIndex);

                return (
                  <div
                    key={skill.id}
                    style={{
                      transform: `translateX(${offset}px)`,
                      transition: "transform 0.3s ease",
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
      <div style={{ textAlign: "center", padding: "40px 0 20px", color: "var(--text-muted)" }}>
        <div style={{ fontSize: 48 }}>🦜</div>
        <div style={{ fontWeight: 700, marginTop: 8 }}>You&apos;ve reached the end!</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>Practice completed skills to earn more XP</div>
      </div>
    </div>
  );
}

// Maps skill → first lesson ID.
// In our seeded data lesson IDs align with skill IDs (1-to-1 for single-lesson skills,
// multi-lesson skills use the same id as the first lesson). Works for the seeded content.
function getFirstLessonId(skill: Skill, _units: Unit[], _unitIndex: number, _skillIndex: number): number {
  return skill.id;
}

function SkillTreeSkeleton() {
  return (
    <div className="skill-tree">
      {[1, 2, 3].map((u) => (
        <div key={u}>
          <div style={{ height: 80, borderRadius: "var(--radius-lg)", background: "var(--bg-secondary)", marginBottom: 16, animation: "pulse 1.5s infinite" }} />
          <div className="skill-path">
            {[1, 2, 3].map((s) => (
              <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--bg-secondary)", animation: "pulse 1.5s infinite" }} />
                <div style={{ width: 60, height: 12, borderRadius: 6, background: "var(--bg-secondary)" }} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
