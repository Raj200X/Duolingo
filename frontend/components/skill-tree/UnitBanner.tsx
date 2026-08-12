"use client";

import type { Unit } from "@/types";

interface UnitBannerProps {
  unit: Unit;
  index: number;
}

export function UnitBanner({ unit, index }: UnitBannerProps) {
  return (
    <div
      className="unit-banner"
      style={{ background: unit.color_hex }}
    >
      <span style={{ fontSize: 32, lineHeight: 1 }}>{unit.icon || "📚"}</span>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, textTransform: "uppercase", letterSpacing: "1px" }}>
          Unit {index + 1}
        </div>
        <div style={{ fontSize: 20, fontWeight: 900 }}>{unit.title}</div>
        {unit.description && (
          <div style={{ fontSize: 13, opacity: 0.9, marginTop: 2, fontWeight: 600 }}>
            {unit.description}
          </div>
        )}
      </div>
    </div>
  );
}
